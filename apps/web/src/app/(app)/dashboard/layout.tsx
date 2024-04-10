import { Suspense } from "react";

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
  return (
    <Suspense fallback={"Loading..."}>
      {children}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(275px, 1fr) 3fr 1.5fr",
          width: "100%",
          height: "100dvh",
        }}
      >
        {selector}
        {content}
        {details}
      </div>
    </Suspense>
  );
}
