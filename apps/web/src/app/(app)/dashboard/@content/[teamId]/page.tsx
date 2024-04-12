import { DashContent } from "@/app/(app)/dashboard/@content/content";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default function Content({
  params,
}: {
  params: Pick<DashboardParams, "teamId">;
}) {
  return <DashContent type={"team"} teamId={params.teamId} />;
}
