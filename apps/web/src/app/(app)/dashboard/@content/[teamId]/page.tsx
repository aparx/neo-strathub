import { DashContent } from "@/app/(app)/dashboard/@content/content";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";

export default function Content({
  params,
  searchParams,
}: {
  params: { teamId: string };
  searchParams: Partial<Record<string, string>>;
}) {
  return (
    <DashContent
      teamId={params.teamId}
      bookId={searchParams[DASHBOARD_QUERY_PARAMS.book]}
      searchParams={searchParams}
    />
  );
}
