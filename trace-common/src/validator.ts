import type { ZodSchema } from "zod";
import {
  mfaCodeSchema, assetCreationSchema, userCreationSchema, locationCreationSchema, userLoginSchema,
  idTokenPayloadSchema, accessTokenPayloadSchema, refreshTokenPayloadSchema, 
  genericClaimStructureSchema,
  tokensSchema} from "./schemas";
import type { AssetCreationAttributes, UserCreationAttributes, LocationCreationAttributes } from "./attributeTypes";
import type { AccessTokenPayload, GenericClaimStructure, IdTokenPayload, RefreshTokenPayload, Tokens, UserLogin } from "./authenticationTypes";

const validate = <T>(data: unknown, schema: ZodSchema<T>): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Validator<T> = (data: unknown) => T;

export const validateAsset: Validator<AssetCreationAttributes> = (data: unknown) => validate<AssetCreationAttributes>(data, assetCreationSchema);
export const validateUser: Validator<UserCreationAttributes> = (data: unknown) => validate<UserCreationAttributes>(data, userCreationSchema);
export const validateLocation: Validator<LocationCreationAttributes> = (data: unknown) => validate<LocationCreationAttributes>(data, locationCreationSchema);
export const validateUserLogin: Validator<UserLogin> = (data: unknown) => validate<UserLogin>(data, userLoginSchema);
export const validateTokens: Validator<Tokens> = (data: unknown) => validate<Tokens>(data, tokensSchema);
export const validateIdTokenPayload: Validator<IdTokenPayload> = (data: unknown) => validate<IdTokenPayload>(data, idTokenPayloadSchema);
export const validateAccessTokenPayload: Validator<AccessTokenPayload> = (data: unknown) => validate<AccessTokenPayload>(data, accessTokenPayloadSchema);
export const validateRefreshTokenPayload: Validator<RefreshTokenPayload> = (data: unknown) => validate<RefreshTokenPayload>(data, refreshTokenPayloadSchema);

export const validateIdToken: Validator<IdTokenPayload & GenericClaimStructure> =
  (data: unknown) => validate<IdTokenPayload & GenericClaimStructure>(data, genericClaimStructureSchema.extend(idTokenPayloadSchema.shape));
export const validateAccessToken: Validator<AccessTokenPayload & GenericClaimStructure> =
  (data: unknown) => validate<AccessTokenPayload & GenericClaimStructure>(data, genericClaimStructureSchema.extend(accessTokenPayloadSchema.shape));
export const validateRefreshToken: Validator<RefreshTokenPayload & GenericClaimStructure> =
  (data: unknown) => validate<RefreshTokenPayload & GenericClaimStructure>(data, genericClaimStructureSchema.extend(refreshTokenPayloadSchema.shape));

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode: Validator<string> = (data: unknown): string => {
  const union = validate(data, mfaCodeSchema);
  if (typeof union === "string") {
    return union;
  }
  return union.code;
};
