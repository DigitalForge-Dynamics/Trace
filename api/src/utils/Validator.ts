import { z } from "zod";
import { Request } from "express";
import ErrorController from "../controllers/ErrorController";
import { AssetCreationAttributes, LocationCreationAttributes, UserCreationAttributes, Scope } from "./types/attributeTypes";
import { UserLogin } from "./types/authenticationTypes";
import Logger from "./Logger";
import type { ParsedQs } from "qs";

type QueryValue = string | string[] | ParsedQs | ParsedQs[] | undefined;

export const getOptString = (value: QueryValue): string | undefined => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }
  throw ErrorController.BadRequestError();
};

export const getInt = (value: string | undefined): number => {
  if (value === undefined) {
    throw ErrorController.BadRequestError();
  }
  const result = parseInt(value);
  if (isNaN(result)) {
    throw ErrorController.BadRequestError()
  }
  return result;
};

export const getId = (request: Request): number => {
  const { id } = request.params;
  return getInt(id);
};

const assetCreationSchema = z.object({
  assetTag: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  nextAuditDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

const userCreationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  scope: z.array(z.nativeEnum(Scope)),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

const locationCreationSchema = z.object({
  locationName: z.string(),
  geoLocation: z.any().optional(),
  primaryLocation: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

const mfaCodeSchema = z.union([
  z.string().refine((val) => /^[0-9]{6}$/.test(val)),
  z.object({
    code: z.string().refine((val) => /^[0-9]{6}$/.test(val)),
  }).strict(),
]);

const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
  mfaCode: z.any().refine((val) => parseMFACode(val)).optional(),
}).strict();

export const validateAsset = (data: unknown): AssetCreationAttributes => {
  const result = assetCreationSchema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return result.data;
};

export const validateUser = (data: unknown): UserCreationAttributes => {
  const result = userCreationSchema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return result.data;
};

export const validateLocation = (data: unknown): LocationCreationAttributes => {
  const result = locationCreationSchema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
    throw ErrorController.BadRequestError("Invalid Request");
  }
  return result.data;
};

export const validateUserLogin = (data: unknown): UserLogin => {
  const result = userLoginSchema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
  throw ErrorController.BadRequestError();
  }
  return result.data;
};

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode = (data: unknown): string => {
  const result = mfaCodeSchema.safeParse(data);
  if (!result.success) {
      Logger.error("Provided MFA code does not match required format");
    throw ErrorController.BadRequestError();
  }
  const union = result.data;
  if (typeof union === "string") {
    return union;
  }
  return union.code;
};
