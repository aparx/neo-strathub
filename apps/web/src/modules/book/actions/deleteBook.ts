"use server";

import { getUser } from "@/modules/auth/actions";
import { hasFlag, TeamMemberFlags } from "@/modules/auth/flags";
import { getMember } from "@/modules/team/actions/member/getMember";
import { getServer, getServiceServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";

function createError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function deleteBook(id: string) {
  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  const { data: book, error } = await getServer(cookies())
    .from("book")
    .select("id, team_id")
    .eq("id", id)
    .single();
  if (!book) return createError(error);

  // Check if user is even authorized to create this book
  const selfMember = await getMember(user.id, book.team_id);
  if (!selfMember) return createError("Not a member of this team");

  if (!hasFlag(selfMember.team_member_role.flags, TeamMemberFlags.DELETE_BOOKS))
    return createError("Missing the permission to delete a book");

  const remove = await getServiceServer(cookies())
    .from("book")
    .delete()
    .eq("id", id);

  if (remove.error)
    // Error occurred on the database, forward that error
    return createError(remove.error);

  return { state: "success" } as const;
}
