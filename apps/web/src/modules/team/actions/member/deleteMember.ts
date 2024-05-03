"use server";

import { getUser } from "@/modules/auth/actions";
import {
  getMember,
  TeamMemberBase,
} from "@/modules/team/actions/member/getMember";
import { createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function deleteMember(target: TeamMemberBase) {
  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  // Authorize if user is able to delete given member
  const selfMember = await getMember(user.id, target.team_id);
  if (!selfMember) throw new Error("Not a member of this team");

  if (selfMember.profile_id === target.profile_id)
    // Always allow a user to remove themselves from a team
    return deleteRecord(target.profile_id, target.team_id);

  const targetMember = await getMember(target.profile_id, target.team_id);
  if (!targetMember) throw new Error("Member could not be found");

  if (selfMember.team_member_role.flags <= targetMember.team_member_role.flags)
    throw new Error("Cannot remove users with higher or equal role");

  // Delete the given member
  return deleteRecord(target.profile_id, target.team_id);
}

function deleteRecord(profileId: string, teamId: string) {
  return createServiceServer(cookies())
    .from("team_member")
    .delete()
    .eq("profile_id", profileId)
    .eq("team_id", teamId);
}
