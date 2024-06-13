import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export type TeamMemberData = NonNullable<
  InferAsync<ReturnType<typeof getTeamMember>>
>;

export const getTeamMember = cache(
  async (profileId: string, teamId: string) => {
    const { data } = await getServiceServer(cookies())
      .from("team_member")
      .select("*")
      .eq("profile_id", profileId)
      .eq("team_id", teamId)
      .maybeSingle()
      .throwOnError();
    return data;
  },
);
