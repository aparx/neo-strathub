import { getUser } from "@/modules/auth/actions";
import { UserContextProvider } from "@/modules/auth/context/userContext";
import { ModalController } from "@/modules/modal/components";
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
  selector: React.ReactNode;
  content: React.ReactNode;
  details: React.ReactNode;
}) {
  // Ensure user is fetched at root to ensure authorization
  const user = await getUser(cookies());

  return (
    <UserContextProvider user={user}>
      <div className={css.rootLayout}>
        <LayoutHeader />
        <Suspense fallback={<PageFallback />}>
          <main className={css.gridLayout}>
            {selector}
            {content}
            {details}
          </main>
        </Suspense>
        <ModalController />
        {children}
      </div>
    </UserContextProvider>
  );
}

function PageFallback() {
  return (
    <div className={css.pageFallback}>
      <Spinner size={"2em"} />
    </div>
  );
}
