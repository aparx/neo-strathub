import { z } from "zod";

export const createProfileSchema = z.object({
  name: z
    .string()
    .regex(/^[A-z0-9_]*$/, "Must only consist of alphanumeric or _ characters")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be less than 21 characters"),
});

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
