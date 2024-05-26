"use server";
import { getUser } from "@/modules/auth/actions.ts";
import { createServiceServer } from "@/utils/supabase/server.ts";
import { cookies } from "next/headers";
import {
  CreateProfileSchema,
  createProfileSchema,
} from "./createProfile.schema.ts";

export async function createProfile(inputData: CreateProfileSchema) {
  const validated = createProfileSchema.parse(inputData);

  const user = await getUser(cookies());

  // Profiles can only be created by the service due to potential requirements
  const service = createServiceServer(cookies());
  const { error } = await service.from("profile").insert({
    id: user.id,
    name: validated.name,
  });

  if (process.env.NODE_ENV === "development") {
    // For testing purposes give this actions some random teams
    const teamCount = Math.round(Math.random() * 2) + 1;
    const { data: teams } = await service
      .from("team")
      .select("id")
      .limit(2 * teamCount);
    const { data: roles } = await service.from("member_role").select("id");
    if (teams && roles?.length)
      await service.from("team_member").insert(
        teams
          .sort(() => 0.5 - Math.random())
          .slice(0, teamCount)
          .map((x) => ({
            profile_id: user.id,
            team_id: x.id,
            role_id: roles[Math.floor(Math.random() * (roles.length - 1))]!.id,
          })),
      );
  }

  if (error)
    return {
      state: "error",
      error,
    } as const;

  return {
    state: "success",
    error: null,
  } as const;
}
