"use server";

import { getUser } from "@/modules/auth/actions";
import { hasFlag, TeamMemberFlags } from "@/modules/auth/flags";
import {
  CreateBookSchema,
  createBookSchema,
} from "@/modules/book/actions/createBook.schema";
import { getMember } from "@/modules/team/actions/member/getMember";
import { getServiceServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { PostgresError } from "pg-error-enum";

function createFormError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createBook(inputData: CreateBookSchema) {
  // Parse input data and ensure data authenticity
  const validated = createBookSchema.parse(inputData);

  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  // Check if user is even authorized to create this book
  const selfMember = await getMember(user.id, validated.teamId);
  if (!selfMember) throw new Error("Not a member of this team");

  if (!hasFlag(selfMember.team_member_role.flags, TeamMemberFlags.MODIFY_BOOKS))
    throw new Error("Missing the permission to create a book");

  const create = await getServiceServer(cookies()).rpc("create_book", {
    book_name: validated.name,
    target_team_id: validated.teamId,
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
