import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default async function DetailsPage({
  params,
}: {
  params: DashboardParams;
}) {
  return <div>Details {params.teamId}</div>;
}
