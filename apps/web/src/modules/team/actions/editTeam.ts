"use server";
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
      error: validatedFields.error.flatten().fieldErrors,
    };

  // TODO ...
  return { state: "success" };
}
