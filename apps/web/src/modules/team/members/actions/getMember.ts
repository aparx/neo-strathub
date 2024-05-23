import { getServiceServer } from "@/utils/supabase/actions";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";

export const getMember = cache(async (profileId: string, teamId: string) => {
  return (
    await getServiceServer(cookies())
      .from("team_member")
      .select("team_id, profile_id, member_role!inner(id, flags)")
      .eq("profile_id", profileId)
      .eq("team_id", teamId)
      .single()
  ).data;
});

export type TeamMember = NonNullable<InferAsync<ReturnType<typeof getMember>>>;
