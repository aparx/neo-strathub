"use server";
import { getUser } from "@/modules/auth/actions";
import {
  getMember,
  TeamMemberBase,
} from "@/modules/team/modals/members/actions/getMember";
import { getServer } from "@/utils/supabase/actions";
import { createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function updateMember(target: TeamMemberBase, newRoleId: number) {
  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  // Authorize if user is able to update target actions
  const selfMember = await getMember(user.id, target.team_id);
  if (!selfMember) throw new Error("Not a actions of this team");

  const targetMember = await getMember(target.profile_id, target.team_id);
  if (!targetMember) throw new Error("Member could not be found");

  const { data: targetRole } = await getServer(cookies())
    .from("team_member_role")
    .select("flags")
    .eq("id", newRoleId)
    .single();
  if (!targetRole) throw new Error("Target role is not existing");

  if (targetRole.flags > selfMember.team_member_role.flags)
    throw new Error("Cannot update to roles higher than yourself");

  if (targetMember.team_member_role.flags >= selfMember.team_member_role.flags)
    throw new Error("Cannot change members whose role is higher or equal");

  // Update the target actions
  return createServiceServer(cookies())
    .from("team_member")
    .update({ role_id: newRoleId })
    .eq("team_id", target.team_id)
    .eq("profile_id", target.profile_id);
}
