"use server";
import { getUser } from "@/modules/auth/actions";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { ServiceServer, createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";

function createError(message: string) {
  return { state: "error", message } as const;
}

export async function deleteMember(profileId: string, teamId: string) {
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  const server = createServiceServer(cookies());

  // Get authenticated member and ensure existence
  const { data: selfMember } = await server
    .from("team_member")
    .select("team_member_role!inner(flags)")
    .eq("team_id", teamId)
    .eq("profile_id", user.id)
    .single();
  if (!selfMember) return createError("Must be a member of that team");

  if (profileId === user.id)
    // Always allow the own user to remove themselves from a team
    return commitRemoval(server, profileId, teamId);

  // Check if the user is authorized to remove members
  if (!hasFlag(selfMember.team_member_role.flags, TeamMemberFlags.KICK_MEMBERS))
    return createError("No permission");

  // Get target member and ensure existence
  const { data: targetMember } = await server
    .from("team_member")
    .select("team_member_role!inner(flags)")
    .eq("profile_id", profileId)
    .eq("team_id", teamId)
    .single();
  if (!targetMember) return createError("Target member does not exist");

  // Check if the user is actually able to remove target member
  if (selfMember.team_member_role.flags <= targetMember.team_member_role.flags)
    return createError("No permission to change this member");

  return commitRemoval(server, profileId, teamId);
}

async function commitRemoval(
  server: ServiceServer,
  profileId: string,
  teamId: string,
) {
  const { error } = await server
    .from("team_member")
    .delete()
    .eq("profile_id", profileId)
    .eq("team_id", teamId);
  if (error) return { state: "error", ...error } as const;
  return { state: "success" } as const;
}
