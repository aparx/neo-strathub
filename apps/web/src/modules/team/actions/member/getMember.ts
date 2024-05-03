import { getServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";

export const getMember = cache(async (profileId: string, teamId: string) => {
  return (
    await getServer(cookies())
      .from("team_member")
      .select("team_id, profile_id, team_member_role!inner(id, flags)")
      .eq("profile_id", profileId)
      .eq("team_id", teamId)
      .single()
  ).data;
});

export type TeamMember = NonNullable<InferAsync<ReturnType<typeof getMember>>>;

export type TeamMemberBase = Pick<TeamMember, "team_id" | "profile_id">;
