import { Flexbox } from "@repo/ui/components";

export default async function Content({
  params,
}: {
  params: { teamId: string };
}) {
  return (
    <Flexbox orient={"vertical"} gap={"lg"}>
      Content at team
    </Flexbox>
  );
}
