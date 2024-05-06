"use server";
import { getUser } from "@/modules/auth/actions";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { PostgresError } from "pg-error-enum";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string().min(3).max(20),
  planId: z.number().positive(),
});

function createError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createTeam(lastState: any, formData: FormData) {
  // Parse form data
  const validatedFields = inputSchema.safeParse({
    name: formData.get("name"),
    planId: Number(formData.get("planId")),
  });
  if (!validatedFields.success)
    return createError(validatedFields.error?.flatten().fieldErrors);

  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  const create = await getServer(cookies()).rpc("create_team", {
    team_name: validatedFields.data.name,
    target_plan_id: validatedFields.data.planId,
  });

  if (create.error) {
    let errorArray = new Array<string>(1);
    if (create.error.code === PostgresError.UNIQUE_VIOLATION)
      errorArray.push("Name must be unique");
    else if (create.error.code === PostgresError.RAISE_EXCEPTION)
      errorArray.push(create.error.message);
    return createError({ name: errorArray });
  }

  return {
    state: "success",
    createdId: create.data,
  } as const;
}
