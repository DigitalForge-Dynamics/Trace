import { z } from "zod";

const envSchema = z.strictObject({
  KEYCLOAK_ISSUER: z
    .url()
    .transform((url) => new URL(url))
    .optional(),
  KEYCLOAK_AUDIENCE: z.string().optional(),
  CLOUDFLARE_ISSUER: z
    .url()
    .transform((url) => new URL(url))
    .optional(),
  CLOUDFLARE_AUDIENCE: z.string().optional(),
  GITHUB_AUDIENCE: z.string().optional(),
  DATABASE_URL: z
    .url()
    .transform((url) => new URL(url))
    .optional(),
  TRACE_ADMIN_ISSUER: z.url().transform((url) => new URL(url)),
  TRACE_ADMIN_SUB: z.string(),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.loose().parse(Bun.env);

export type { Env };
export { env };
