import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3000),
  JWT_PRIVATE_KEY: z.coerce.string(),
  JWT_PUBLIC_KEY: z.coerce.string(),
});

export type Env = z.infer<typeof envSchema>;
