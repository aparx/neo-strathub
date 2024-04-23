"use server";
import { createServiceServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const editTeamSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(20),
});

export async function editTeam(prevState: any, formData: FormData) {
  const validatedFields = editTeamSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success)
    return {
      state: "error",
      errors: validatedFields.error.flatten().fieldErrors,
    } as const;

  // TODO either RLS or edit here
  await createServiceServer(cookies())
    .from("team")
    .update({ name: validatedFields.data.name })
    .eq("id", validatedFields.data.id);

  return { state: "success" } as const;
}
