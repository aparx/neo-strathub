import { z } from "zod";

export const createBookSchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(3).max(32),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;