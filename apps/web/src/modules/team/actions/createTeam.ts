"use server";
import { getUser } from "@/modules/auth/actions";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { PostgresError } from "pg-error-enum";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(3).max(20),
});

function createError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createTeam(lastState: any, formData: FormData) {
  // Parse form data
  const validatedFields = inputSchema.safeParse({
    name: formData.get("name"),
  });
  if (!validatedFields.success)
    return createError(validatedFields.error?.flatten().fieldErrors);

  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  // Use the authorized anon server to try to create a team, to ensure RLS
  const insertion = await getServer(cookies())
    .from("team")
    .insert({ name: validatedFields.data!.name })
    .select("id")
    .single();
  if (insertion.error) {
    let errorArray = new Array<string>(1);
    if (insertion.error.code === PostgresError.UNIQUE_VIOLATION)
      errorArray.push("Name must be unique");
    else if (insertion.error.code === PostgresError.RAISE_EXCEPTION)
      errorArray.push(insertion.error.message);
    return createError({ name: errorArray });
  }

  return {
    state: "success",
    createdId: insertion.data.id,
  } as const;
}
