import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^\S[A-z0-9_ ]*$/, "Name must not contain special characters"),
  planId: z.number().positive(),
  gameId: z.number().positive(),
});

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
