"use server";
import { getUser } from "@/modules/auth/actions";
import {
  CreateTeamSchema,
  createTeamSchema,
} from "@/modules/team/actions/createTeam.schema";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { PostgresError } from "pg-error-enum";

function createError<T>(error: T) {
  return { state: "error", error } as const;
}

export async function createTeam(team: CreateTeamSchema) {
  // Parse input data and ensure data authenticity
  const validatedFields = createTeamSchema.parse(team);

  // Authenticate and ensure user is logged in
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  const create = await getServer(cookies()).rpc("create_team", {
    team_name: validatedFields.name.trim(),
    target_plan_id: validatedFields.planId,
    target_game_id: validatedFields.gameId,
  });

  if (create.error) {
    console.log(create.error);

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
