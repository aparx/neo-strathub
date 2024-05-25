import { z } from "zod";

export const createBookSchema = z.object({
  teamId: z.string().uuid(),
  name: z
    .string()
    .regex(/^(?!\s*$).+/, "Name must not be empty")
    .min(2)
    .max(32),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;
