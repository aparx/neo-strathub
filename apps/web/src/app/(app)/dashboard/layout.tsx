import { PropsWithChildren, Suspense } from "react";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={"Loading..."}>{children}</Suspense>;
}
