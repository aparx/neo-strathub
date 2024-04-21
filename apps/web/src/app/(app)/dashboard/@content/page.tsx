import { DashContent } from "./content";

export default async function Content({
  searchParams,
}: {
  searchParams: Partial<Record<string, string>>;
}) {
  return <DashContent searchParams={searchParams} />;
}
