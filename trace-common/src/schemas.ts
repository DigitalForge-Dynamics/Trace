import { ZodSchema, z} from "zod";

import { AssetCreationAttributes, UserCreationAttributes, Scope, LocationCreationAttributes, Status } from "./attributeTypes";
import { AccessTokenPayload, GenericClaimStructure, IdTokenPayload, RefreshTokenPayload, TokenUse, UserLogin, Tokens } from "./authenticationTypes";
import { parseMFACode } from "./validator";
import type { UUID } from "./misc";
import "./ZodExtend";

export const assetCreationSchema = z.object({
  assetTag: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  status: z.nativeEnum(Status),
  nextAuditDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions() satisfies ZodSchema<AssetCreationAttributes>;

export const userCreationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  scope: z.array(z.nativeEnum(Scope)),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions() satisfies ZodSchema<UserCreationAttributes>;

export const locationCreationSchema = z.object({
  locationName: z.string(),
  geoLocation: z.any().optional(),
  primaryLocation: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions() satisfies ZodSchema<LocationCreationAttributes>;

export const mfaCodeSchema = z.union([
  z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  z.object({
    code: z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  }).strict(),
]);

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
  mfaCode: z.string().refine((val) => parseMFACode(val)).optional(),
}).strict().exactOptions() satisfies ZodSchema<UserLogin>;

export const refreshTokenPayloadSchema = z.object({
  token_use: z.literal(TokenUse.Refresh),
  username: z.string(),
}).strict() satisfies ZodSchema<RefreshTokenPayload>;

export const accessTokenPayloadSchema = z.object({
  token_use: z.literal(TokenUse.Access),
  scope: z.nativeEnum(Scope).array(),
}).strict() satisfies ZodSchema<AccessTokenPayload>;

export const idTokenPayloadSchema = z.object({
  token_use: z.literal(TokenUse.Id),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
}).strict() satisfies ZodSchema<IdTokenPayload>;

export const genericClaimStructureSchema = z.object({
  iss: z.string(),
  sub: z.string().uuid() as ZodSchema<UUID>,
  aud: z.string(),
  exp: z.number(),
  iat: z.number(),
  token_use: z.nativeEnum(TokenUse),
}).strict() satisfies ZodSchema<GenericClaimStructure>;

export const tokensSchema = z.object({
  accessToken: z.string(),
  idToken: z.string(),
  refreshToken: z.string(),
}).strict() satisfies ZodSchema<Tokens>;
