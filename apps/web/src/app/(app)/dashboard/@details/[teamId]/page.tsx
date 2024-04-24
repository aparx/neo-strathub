import { DetailsContent } from "@/app/(app)/dashboard/@details/content";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";

export default async function DetailsPage({
  params,
  searchParams,
}: {
  params: { teamId: string };
  searchParams: Partial<Record<string, string>>;
}) {
  return (
    <DetailsContent
      teamId={params.teamId}
      bookId={searchParams[DASHBOARD_QUERY_PARAMS.book]}
      documentId={searchParams[DASHBOARD_QUERY_PARAMS.document]}
    />
  );
}
