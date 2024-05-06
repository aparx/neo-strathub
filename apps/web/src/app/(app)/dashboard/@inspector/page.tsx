import { PreviewContent } from "@/app/(app)/dashboard/@inspector/content";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";

export default function Preview({
  params,
  searchParams,
}: {
  params: { teamId?: string };
  searchParams: Partial<Record<string, string>>;
}) {
  return (
    <PreviewContent
      teamId={params.teamId}
      bookId={searchParams[DASHBOARD_QUERY_PARAMS.book]}
      documentId={searchParams[DASHBOARD_QUERY_PARAMS.document]}
    />
  );
}
