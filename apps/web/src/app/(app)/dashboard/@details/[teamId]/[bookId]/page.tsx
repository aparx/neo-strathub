import { DetailsContent } from "@/app/(app)/dashboard/@details/content";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default async function DetailsPage({
  params,
}: {
  params: DashboardParams;
}) {
  return (
    <DetailsContent
      type={"collection"}
      teamId={params.teamId}
      bookId={params.bookId}
    />
  );
}
