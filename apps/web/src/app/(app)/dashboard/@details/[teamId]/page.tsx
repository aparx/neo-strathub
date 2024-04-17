import { DetailsContent } from "@/app/(app)/dashboard/@details/content";
import {
  DASHBOARD_QUERY_PARAMS,
  DashboardParams,
} from "@/app/(app)/dashboard/_utils";

export default async function DetailsPage({
  params,
  searchParams,
}: {
  params: Pick<DashboardParams, "teamId">;
  searchParams: { [key: string]: string };
}) {
  return (
    <DetailsContent
      type={"team"}
      teamId={params.teamId}
      documentId={searchParams[DASHBOARD_QUERY_PARAMS.document]}
    />
  );
}
