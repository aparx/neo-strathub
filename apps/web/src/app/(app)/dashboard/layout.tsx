import { vars } from "@repo/theme";
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
          gridTemplateColumns: "1fr 3fr 1.5fr",
          gap: vars.spacing.md,
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
