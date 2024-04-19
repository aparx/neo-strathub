"use server";
import {
  getBlueprintCount,
  getBookCount,
  getMemberCount,
  getTeam,
} from "@/modules/team/actions";
import { vars } from "@repo/theme";
import { Flexbox, Progress, Skeleton, Text } from "@repo/ui/components";
import { Suspense } from "react";
import * as css from "./teamSection.css";

interface StatisticFieldData {
  name: string;
  fetch: (team: {
    id: string;
    plan: { config: any | null } | null;
  }) => Promise<{
    count?: number | null;
    max?: number | null;
  }>;
}

const statFields = [
  {
    name: "Members",
    fetch: async ({ id }) => ({
      count: await getMemberCount(id),
      max: 20,
    }),
  },
  {
    name: "Books",
    fetch: async ({ id }) => ({
      count: await getBookCount(id),
      max: 20,
    }),
  },
  {
    name: "Blueprints",
    fetch: async ({ id }) => ({
      count: await getBlueprintCount(id),
      max: 20,
    }),
  },
] as const satisfies StatisticFieldData[];

export async function TeamSection({ teamId }: { teamId: string }) {
  const { data: team } = await getTeam(teamId);
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
            <StatisticField {...field} name={field.name} team={team} />
          </Suspense>
        ))}
      </Flexbox>
    </section>
  );
}

interface StatisticFieldProps extends StatisticFieldData {
  team: Parameters<StatisticFieldData["fetch"]>[0];
}

async function StatisticField({ team, name, fetch }: StatisticFieldProps) {
  const data = await fetch(team);
  return (
    <Flexbox asChild justify={"space-between"} align={"center"}>
      <Text style={{ color: vars.colors.emphasis.medium }}>
        <span aria-hidden>{name}</span>
        <Flexbox gap="md" align={"center"} style={{ fontWeight: 500 }}>
          {data.count ?? 0}
          <Progress.CircularColorStep
            label={name}
            size={"1.2em"}
            value={data.count ?? 0}
            max={data.max ?? 0}
          />
        </Flexbox>
      </Text>
    </Flexbox>
  );
}
