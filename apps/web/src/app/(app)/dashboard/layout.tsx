import { getUser } from "@/modules/auth/actions";
import { Spinner } from "@repo/ui/components";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { LayoutHeader } from "./_partial";
import * as css from "./layout.css";

export default async function DashboardLayout({
  children,
  content,
  selector,
  details,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  details: React.ReactNode;
  selector: React.ReactNode;
}) {
  // Ensure user is fetched at root to ensure authorization
  await getUser(cookies());

  return (
    <>
      <div className={css.rootLayout}>
        <LayoutHeader />
        <Suspense fallback={<PageFallback />}>
          <main className={css.gridLayout}>
            {selector}
            {content}
            {details}
          </main>
        </Suspense>
      </div>
      {children}
    </>
  );
}

function PageFallback() {
  return (
    <div className={css.pageFallback}>
      <Spinner size={"2em"} />
    </div>
  );
}
