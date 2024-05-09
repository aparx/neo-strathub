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
  name: z.string().min(3).max(20),
});

function createFormError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createBook(lastState: any, formData: FormData) {
  // Parse form data and ensure data authenticity
  const validatedFields = inputSchema.safeParse({
    teamId: formData.get("teamId"),
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

  const create = await getServiceServer(cookies()).rpc("create_book", {
    book_name: validatedFields.data.name,
    target_team_id: validatedFields.data.teamId,
  });

  if (create.error) {
    let errorArray: string[] = [];
    if (create.error.code === PostgresError.UNIQUE_VIOLATION)
      errorArray.push("A book with this name already exists for this team");
    else if (create.error.code === PostgresError.RAISE_EXCEPTION)
      errorArray.push(create.error.message);
    else throw create.error;
    return createFormError({ name: errorArray });
  }

  return {
    state: "success",
    createdId: create.data,
  } as const;
}
