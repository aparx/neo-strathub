import { DashColumn } from "@/app/(app)/dashboard/_components";
import * as css from "@/app/(app)/dashboard/layout.css";
import { Callout } from "@repo/ui/components";

export function Sidebar({
  inspector,
  details,
}: {
  inspector: React.ReactNode;
  details: React.ReactNode;
}) {
  return (
    <DashColumn.Root asChild>
      <aside>
        <DashColumn.Content className={css.sidebarContent}>
          <Callout.Warning>
            Warning: Alpha version. Data may be lost.
          </Callout.Warning>
          {inspector}
          {details}
        </DashColumn.Content>
      </aside>
    </DashColumn.Root>
  );
}
