"use server";
import {
  getBlueprintCount,
  getBookCount,
  getMemberCount,
  getTeam,
} from "@/modules/team/actions";
import { vars } from "@repo/theme";
import { Button, Flexbox, Progress, Skeleton, Text } from "@repo/ui/components";
import { createLineHeight } from "@repo/ui/utils";
import { Suspense } from "react";
import { MdArrowForward } from "react-icons/md";
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
    <section>
      <div className={css.main}>
        <Flexbox asChild gap={"lg"} align={"center"}>
          <header>
            <Text type={"title"} size={"sm"}>
              {team.name}
            </Text>
          </header>
        </Flexbox>
        <Flexbox orient={"vertical"} gap={"md"}>
          {statFields.map((field) => (
            <Suspense
              key={field.name}
              fallback={<Skeleton height={createLineHeight("1em")} />}
            >
              <StatisticField {...field} name={field.name} team={team} />
            </Suspense>
          ))}
        </Flexbox>
      </div>
      <div className={css.annotation} style={{ borderTop: "unset" }}>
        <Button color={"cta"} appearance={"cta"} className={css.upgradeButton}>
          Upgrade Plan
          <MdArrowForward />
        </Button>
      </div>
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
