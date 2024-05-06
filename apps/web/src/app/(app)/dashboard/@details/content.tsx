import { ExtendedContentPathProps } from "@/app/(app)/dashboard/_utils";
import { getCounts, getTeam } from "@/modules/team/actions";
import { vars } from "@repo/theme";
import { Flexbox, Progress, Skeleton, Text } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { Suspense } from "react";
import * as css from "./content.css";

interface StatisticFieldData {
  name: string;
  field: keyof InferAsync<ReturnType<typeof getCounts>>;
}

const statFields = [
  {
    name: "Members",
    field: "members",
  },
  {
    name: "Books",
    field: "books",
  },
  {
    name: "Blueprints",
    field: "blueprints",
  },
] as const satisfies StatisticFieldData[];

export async function DetailsContent(props: ExtendedContentPathProps) {
  if (!props.teamId) return null;
  const { data: team } = await getTeam(props.teamId);
  if (!team) return null;

  return (
    <section className={css.main}>
      <Flexbox asChild gap={"lg"} align={"center"}>
        <header>
          <Text type={"title"} size={"sm"}>
            {team.name}
          </Text>
        </header>
      </Flexbox>
      <Flexbox orient={"vertical"} gap={"md"}>
        {statFields.map((field) => (
          <Suspense key={field.name} fallback={<Skeleton />}>
            <StatisticField {...field} name={field.name} teamId={team.id} />
          </Suspense>
        ))}
      </Flexbox>
    </section>
  );
}

async function StatisticField({
  teamId,
  name,
  field,
}: StatisticFieldData & {
  teamId: string;
}) {
  const data = await getCounts(teamId);
  const value = data[field];
  return (
    <Flexbox asChild justify={"space-between"} align={"center"}>
      <Text style={{ color: vars.colors.emphasis.medium }}>
        <span aria-hidden>{name}</span>
        <Flexbox gap="md" align={"center"} style={{ fontWeight: 500 }}>
          {value.count ?? 0}
          <Progress.CircularColorStep
            label={name}
            size={"1.2em"}
            value={value.count ?? 0}
            max={value.max ?? 0}
          />
        </Flexbox>
      </Text>
    </Flexbox>
  );
}
