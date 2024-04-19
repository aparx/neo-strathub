import { DashColumn } from "@/app/(app)/dashboard/_components";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default function DetailsDefault({
  params,
  searchParams,
}: {
  params: Pick<DashboardParams, "teamId">;
  searchParams: { [key: string]: string };
}) {
  return (
    <DashColumn.Root>
      <DashColumn.Content />
    </DashColumn.Root>
  );
}
