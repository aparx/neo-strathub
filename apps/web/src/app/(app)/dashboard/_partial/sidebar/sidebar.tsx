"use client";
import { DashColumn } from "@/app/(app)/dashboard/_components";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import * as css from "@/app/(app)/dashboard/layout.css";
import { Callout } from "@repo/ui/components";
import { useSearchParams } from "next/navigation";

export function Sidebar({
  inspector,
  details,
}: {
  inspector: React.ReactNode;
  details: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  return (
    <DashColumn.Root asChild>
      <aside>
        <DashColumn.Content className={css.sidebarContent}>
          <Callout.Warning>
            Warning: Alpha version. Data may be lost.
          </Callout.Warning>
          {searchParams.get(DASHBOARD_QUERY_PARAMS.document) && inspector}
          {details}
        </DashColumn.Content>
      </aside>
    </DashColumn.Root>
  );
}
