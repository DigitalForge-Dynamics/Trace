import { ParseInput, ParseReturnType, ZodObject, ZodOptional, ZodRawShape, ZodSchema, ZodType, ZodTypeAny, z } from "zod";
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

// Strict optional, fixing zod issue #510, where .optional infers `K?: T | undefined`, rather than `K?: T`.

declare module "zod" {
  interface ZodObject<T> {
    exactOptions(): any;
  }
}

ZodObject.prototype.exactOptions = function(this) {
  const safeParse = (input: ParseInput) => {
    const result = ZodObject.prototype.safeParse.bind(this)(input);
    if (!result.success) { return result; }
    for (const key in this.shape) {
      if (!(this.shape[key] instanceof ZodOptional)) {continue;}
      if (result.data[key] !== undefined) {continue;}
      return { state: "dirty" };
    }
    return result;
  };

  return {
    safeParse,
  };
};

// Schemas

const assetCreationSchema = z.object({
  assetTag: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  nextAuditDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

type G = z.infer<typeof assetCreationSchema>;

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
  z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  z.object({
    code: z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  }).strict(),
]);

const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
  mfaCode: z.any().refine((val) => parseMFACode(val)).optional(),
}).strict();

const validate = <T>(data: unknown, schema: ZodSchema<T>): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
    throw ErrorController.BadRequestError();
  }
  return result.data;
};

// FIXME: Remove as any, once have fix for exactOptionalTypes
export const validateAsset = (data: unknown): AssetCreationAttributes => validate<AssetCreationAttributes>(data, assetCreationSchema as any);
export const validateUser = (data: unknown): UserCreationAttributes => validate<UserCreationAttributes>(data, userCreationSchema as any);
export const validateLocation = (data: unknown): LocationCreationAttributes => validate<LocationCreationAttributes>(data, locationCreationSchema as any);
export const validateUserLogin = (data: unknown): UserLogin => validate<UserLogin>(data, userLoginSchema);

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode = (data: unknown): string => {
  const union = validate(data, mfaCodeSchema);
  if (typeof union === "string") {
    return union;
  }
  return union.code;
};



