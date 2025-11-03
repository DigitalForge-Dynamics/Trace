import { z } from "zod";

const healthCheckResponse = z
  .strictObject({
    health: z.literal("OK"),
  })
  .readonly();

type HealthCheckResponse = z.infer<typeof healthCheckResponse>;

const errorResponse = z
  .strictObject({
    message: z.string(),
  })
  .readonly();

type ErrorResponse = z.infer<typeof errorResponse>;

const oidcResponse = z
  .strictObject({
    message: z.literal("Authenticated"),
    data: z
      .object({
        sub: z.string(),
        iss: z.url().transform((url) => new URL(url)),
        aud: z.string(),
        iat: z.number().transform((seconds) => new Date(seconds * 1000)),
        nbf: z.number().transform((seconds) => new Date(seconds * 1000)),
        exp: z.number().transform((seconds) => new Date(seconds * 1000)),
      })
      .readonly(),
  })
  .readonly();

type OIDCResponse = z.infer<typeof oidcResponse>;

export type { HealthCheckResponse, ErrorResponse, OIDCResponse };
export { healthCheckResponse, errorResponse, oidcResponse };
