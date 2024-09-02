import type { ZodSchema } from "zod";
import {
  mfaCodeSchema, assetCreationSchema, userCreationSchema, locationCreationSchema, userLoginSchema,
  idTokenPayloadSchema, accessTokenPayloadSchema, refreshTokenPayloadSchema } from "./schemas";
import type { AssetCreationAttributes, UserCreationAttributes, LocationCreationAttributes } from "./attributeTypes";
import type { AccessTokenPayload, IdTokenPayload, RefreshTokenPayload, UserLogin } from "./authenticationTypes";

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
export const validateIdTokenPayload: Validator<IdTokenPayload> = (data: unknown) => validate<IdTokenPayload>(data, idTokenPayloadSchema);
export const validateAccessTokenPayload: Validator<AccessTokenPayload> = (data: unknown) => validate<AccessTokenPayload>(data, accessTokenPayloadSchema);
export const validateRefreshTokenPayload: Validator<RefreshTokenPayload> = (data: unknown) => validate<RefreshTokenPayload>(data, refreshTokenPayloadSchema);

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode: Validator<string> = (data: unknown): string => {
  const union = validate(data, mfaCodeSchema);
  if (typeof union === "string") {
    return union;
  }
  return union.code;
};
