import {
  ZodObject, ZodSchema, ZodRawShape, UnknownKeysParam, ZodTypeAny,
  objectOutputType, objectInputType, z
} from "zod";
import { Request } from "express";
import ErrorController from "../controllers/ErrorController";
import {
  AssetCreationAttributes, LocationCreationAttributes, UserCreationAttributes,
  Scope, NonUndefinedOptional,
  Status
} from "./types/attributeTypes";
import { UserLogin } from "./types/authenticationTypes";
import Logger from "./Logger";
import { ZodObjectExactOption } from "./ZodExtend";
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
  interface ZodObject<
    T extends ZodRawShape,
    UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
    Catchall extends ZodTypeAny = ZodTypeAny,
    Output extends object = objectOutputType<T, Catchall, UnknownKeys>,
    Input extends object = objectInputType<T, Catchall, UnknownKeys>,
  > {
    exactOptions(): ZodObjectExactOption<T, UnknownKeys, Catchall, NonUndefinedOptional<Output>, NonUndefinedOptional<Input>>;
  }
}

ZodObject.prototype.exactOptions = function(this) {
  return new ZodObjectExactOption(this._def);
};

// Schemas

const assetCreationSchema: ZodSchema<AssetCreationAttributes> = z.object({
  assetTag: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  status: z.nativeEnum(Status),
  nextAuditDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

const userCreationSchema: ZodSchema<UserCreationAttributes> = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  scope: z.array(z.nativeEnum(Scope)),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

const locationCreationSchema: ZodSchema<LocationCreationAttributes> = z.object({
  locationName: z.string(),
  geoLocation: z.any().optional(),
  primaryLocation: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

const mfaCodeSchema = z.union([
  z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  z.object({
    code: z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  }).strict(),
]);

const userLoginSchema: ZodSchema<UserLogin> = z.object({
  username: z.string(),
  password: z.string(),
  mfaCode: z.string().refine((val) => parseMFACode(val)).optional(),
}).strict().exactOptions();

const validate = <T>(data: unknown, schema: ZodSchema<T>): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    Logger.error(result.error);
    throw ErrorController.BadRequestError();
  }
  return result.data;
};

export const validateAsset = (data: unknown): AssetCreationAttributes => validate<AssetCreationAttributes>(data, assetCreationSchema);
export const validateUser = (data: unknown): UserCreationAttributes => validate<UserCreationAttributes>(data, userCreationSchema);
export const validateLocation = (data: unknown): LocationCreationAttributes => validate<LocationCreationAttributes>(data, locationCreationSchema);
export const validateUserLogin = (data: unknown): UserLogin => validate<UserLogin>(data, userLoginSchema);

// Checks for either a string literal, or an object of type `{ code: string }`.
export const parseMFACode = (data: unknown): string => {
  const union = validate(data, mfaCodeSchema);
  if (typeof union === "string") {
    return union;
  }
  return union.code;
};
