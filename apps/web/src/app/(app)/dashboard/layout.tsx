import { Sidebar } from "@/app/(app)/dashboard/_partial/sidebar/sidebar";
import { ModalController } from "@/modules/modal/components";
import { Spinner } from "@repo/ui/components";
import { Suspense } from "react";
import { LayoutHeader } from "./_partial";
import * as css from "./layout.css";

export default async function DashboardLayout({
  children,
  content,
  selector,
  details,
  inspector,
}: {
  children: React.ReactNode;
  selector: React.ReactNode;
  content: React.ReactNode;
  details: React.ReactNode;
  inspector: React.ReactNode;
}) {
  return (
    <div className={css.rootLayout}>
      <LayoutHeader />
      <Suspense fallback={<PageFallback />}>
        <div className={css.gridLayout}>
          {selector}
          {content}
          <Sidebar inspector={inspector} details={details} />
        </div>
      </Suspense>
      <ModalController />
      {children}
    </div>
  );
}

function PageFallback() {
  return (
    <div className={css.pageFallback}>
      <Spinner size={"2em"} />
    </div>
  );
}
