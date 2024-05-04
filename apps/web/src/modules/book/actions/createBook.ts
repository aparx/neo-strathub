"use server";

import { getUser } from "@/modules/auth/actions";
import { hasFlag, TeamMemberFlags } from "@/modules/auth/flags";
import { getMember } from "@/modules/team/actions/member/getMember";
import { getServiceServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { PostgresError } from "pg-error-enum";
import { z } from "zod";

const inputSchema = z.object({
  teamId: z.string().uuid(),
  gameId: z.number().int().positive(),
  name: z.string().min(3).max(20),
});

function createFormError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createBook(lastState: any, formData: FormData) {
  // Parse form data and ensure data authenticity
  const validatedFields = inputSchema.safeParse({
    teamId: formData.get("teamId"),
    gameId: Number(formData.get("gameId")),
    name: formData.get("name"),
  });
  if (!validatedFields.success)
    return createFormError(validatedFields.error.flatten().fieldErrors);

  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  // Check if user is even authorized to create this book
  const selfMember = await getMember(user.id, validatedFields.data.teamId);
  if (!selfMember) throw new Error("Not a member of this team");

  if (!hasFlag(selfMember.team_member_role.flags, TeamMemberFlags.MODIFY_BOOKS))
    throw new Error("Missing the permission to create a book");

  // TODO get team and check against the plan's limits

  // Actually commit the insertion of the book
  const insertion = await getServiceServer(cookies())
    .from("book")
    .insert({
      name: validatedFields.data.name,
      game_id: validatedFields.data.gameId,
      team_id: validatedFields.data.teamId,
    })
    .select("id")
    .single();

  if (insertion.error) {
    let errorArray: string[] = [];
    if (insertion.error.code === PostgresError.UNIQUE_VIOLATION)
      errorArray.push("Name must be unique");
    else if (insertion.error.code === PostgresError.RAISE_EXCEPTION)
      errorArray.push(insertion.error.message);
    else throw insertion.error;
    return createFormError({ name: errorArray });
  }

  return {
    state: "success",
    createdId: insertion.data.id,
  } as const;
}
