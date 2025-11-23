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
      .strictObject({
        sub: z.string(),
        iss: z.url().transform((url) => new URL(url)),
        aud: z.string(),
        iat: z.number().transform((seconds) => new Date(seconds * 1000)),
        nbf: z.number().transform((seconds) => new Date(seconds * 1000)),
        exp: z.number().transform((seconds) => new Date(seconds * 1000)),
      })
      .loose()
      .readonly(),
  })
  .readonly();

type OIDCResponse = z.infer<typeof oidcResponse>;

const oidcConfigResponse = z.strictObject({
  config: z
    .strictObject({
      label: z.string().min(1),
      issuer: z.url().transform((url) => new URL(url)),
      audience: z.string().min(1),
      uid: z.uuidv7(),
    })
    .readonly()
    .array(),
});

type OIDCConfigResponse = z.infer<typeof oidcConfigResponse>;

const createUserRequest = z.strictObject({
  username: z.string(),
});

type CreateUserRequest = z.infer<typeof createUserRequest>;

const createUserResponse = z.strictObject({
  username: z.string(),
  uid: z.uuidv7(),
});

type CreateUserResponse = z.infer<typeof createUserResponse>;

const linkUserIdpRequest = z.strictObject({
  userId: z.uuidv7(),
  idp: z.union([z.url().transform((url) => new URL(url)), z.uuidv7()]),
  sub: z.uuidv7(),
});

type LinkUserIdpRequest = z.infer<typeof linkUserIdpRequest>;

export type {
  HealthCheckResponse,
  ErrorResponse,
  OIDCResponse,
  OIDCConfigResponse,
  CreateUserRequest,
  CreateUserResponse,
  LinkUserIdpRequest,
};
export {
  healthCheckResponse,
  errorResponse,
  oidcResponse,
  oidcConfigResponse,
  createUserRequest,
  createUserResponse,
  linkUserIdpRequest,
};
