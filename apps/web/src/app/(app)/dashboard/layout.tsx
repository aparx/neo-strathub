import * as css from "@/app/layout.css";
import { Spinner } from "@repo/ui/components";
import { PropsWithChildren, Suspense } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function PageLoader() {
  return (
    <div className={css.pageSuspense}>
      <Spinner size={"2em"} />
    </div>
  );
}
