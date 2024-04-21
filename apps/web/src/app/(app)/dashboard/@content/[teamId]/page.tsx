import { DashContent } from "@/app/(app)/dashboard/@content/content";
import {
  DASHBOARD_QUERY_PARAMS,
  DashboardParams,
} from "@/app/(app)/dashboard/_utils";

export default function Content({
  params,
  searchParams,
}: {
  params: Pick<DashboardParams, "teamId">;
  searchParams: Partial<Record<string, string>>;
}) {
  return (
    <DashContent
      teamId={params.teamId}
      bookId={searchParams[DASHBOARD_QUERY_PARAMS.book]}
      documentId={searchParams[DASHBOARD_QUERY_PARAMS.document]}
      searchParams={searchParams}
    />
  );
}
