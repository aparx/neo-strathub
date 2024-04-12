import { DashContent } from "@/app/(app)/dashboard/@content/content";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";

export default function Content({ params }: { params: DashboardParams }) {
  return (
    <DashContent
      type={"collection"}
      teamId={params.teamId}
      bookId={params.bookId}
    />
  );
}
