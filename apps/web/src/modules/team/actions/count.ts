"use server";
import { getTeam } from "@/modules/team/actions/getTeam";
import { getServer } from "@/utils/supabase/actions";
import { PlanConfig } from "@/utils/supabase/models";
import { Nullish } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

interface CountData {
  count: number | Nullish;
  max: number;
}

export const getCounts = cache(async (teamId: string) => {
  // Fetch team to get the plan
  const { data: team } = await getTeam(teamId);
  const planConfig = team?.plan?.config as Nullish<PlanConfig>;

  return {
    members: {
      count: await getMemberCount(teamId),
      max: planConfig?.max_members || 10,
    },
    books: {
      count: await getBookCount(teamId),
      max: planConfig?.max_books || 20,
    },
    blueprints: {
      count: await getBlueprintCount(teamId),
      max: planConfig?.max_blueprints || 100,
    },
  } satisfies Record<string, CountData>;
});

async function getBlueprintCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("blueprint")
      .select("id, book!inner(team_id)", { count: "exact", head: true })
      .eq("book.team_id", teamId)
  )?.count;
}

async function getBookCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("book")
      .select("id", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}

async function getMemberCount(teamId: string) {
  return (
    await getServer(cookies())
      .from("team_member")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId)
  )?.count;
}
