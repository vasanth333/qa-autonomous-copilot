import { z } from "zod";

export const analyzeSchema = z.object({
  logs: z
    .array(z.string().min(5))
    .min(1, "At least one log is required"),
});
