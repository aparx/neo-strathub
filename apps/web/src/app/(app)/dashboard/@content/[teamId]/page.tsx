import { DashContent } from "@/app/(app)/dashboard/@content/content";

export default async function Content({
  params,
}: {
  params: { teamId: string };
}) {
  return <DashContent />;
}
