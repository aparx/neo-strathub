import { DetailsContent } from "@/app/(app)/dashboard/@details/content";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default async function DetailsPage({
  params,
}: {
  params: Pick<DashboardParams, "teamId">;
}) {
  return <DetailsContent type={"team"} teamId={params.teamId} />;
}
