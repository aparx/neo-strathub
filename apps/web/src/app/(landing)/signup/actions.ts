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

  // TODO profanity filter?

  const { error } = await createServiceServer(cookies())
    .from("profile")
    .insert({
      id: user.id,
      username: validated.data.username,
      role: "user",
    });

  if (error)
    return {
      state: "error",
      error,
    } as const;

  return {
    state: "success",
  } as const;
}
