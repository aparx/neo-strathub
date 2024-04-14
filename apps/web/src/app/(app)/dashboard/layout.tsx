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
  return (
    <div className={css.rootLayout}>
      <LayoutHeader />
      <main className={css.gridLayout}>
        {selector}
        {content}
        {details}
      </main>
    </div>
  );
}
