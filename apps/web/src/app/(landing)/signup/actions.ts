"use server";

import { getUser } from "@/modules/auth/actions";
import { createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const createInputSchema = z.object({
  username: z.string().min(3).max(20),
});

export async function createProfile(lastState: any, formData: FormData) {
  const user = await getUser(cookies());
  if (!user) return { state: "unauthenticated" };
  const validated = createInputSchema.safeParse({
    username: formData.get("username"),
  });
  if (!validated.success)
    return {
      state: "error",
      message: validated.error.flatten().fieldErrors,
    } as const;

  // Profiles can only be created by the service due to potential requirements
  const service = createServiceServer(cookies());
  const { error } = await service.from("profile").insert({
    id: user.id,
    username: validated.data.username,
    role: "user",
  });

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    // For testing purposes give this actions some random teams
    const teamCount = Math.round(Math.random() * 2) + 1;
    const { data: teams } = await service
      .from("team")
      .select("id")
      .limit(2 * teamCount);
    const { data: roles } = await service.from("team_member_role").select("id");
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
  } as const;
}
