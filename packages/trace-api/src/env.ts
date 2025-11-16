import { z } from "zod";

const envSchema = z.strictObject({
  KEYCLOAK_ISSUER: z.url().transform((url) => new URL(url)),
  KEYCLOAK_AUDIENCE: z.string(),
  CLOUDFLARE_ISSUER: z.url().transform((url) => new URL(url)),
  CLOUDFLARE_AUDIENCE: z.string(),
  GITHUB_AUDIENCE: z.string(),
});

type Env = z.infer<typeof envSchema>;

const env: Env = envSchema.loose().parse(Bun.env);

export type { Env };
export { env };
