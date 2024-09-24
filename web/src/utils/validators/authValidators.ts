import { z, ZodSchema } from "zod";
import { validate, Validator } from "trace_common";
import { AuthData } from "../types/authTypes";

export {
  validateTokens,
  validateIdToken,
  validateAccessToken,
  validateRefreshToken,
} from "trace_common";

export const authDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiry: z.number(),
  refreshExpiry: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
}).strict() satisfies ZodSchema<AuthData>;

export const validateAuthData: Validator<AuthData> = (data: unknown) => validate<AuthData>(data, authDataSchema);
