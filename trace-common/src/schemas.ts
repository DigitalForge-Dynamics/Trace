import { ZodSchema, z} from "zod";

import { AssetCreationAttributes, UserCreationAttributes, Scope, LocationCreationAttributes } from "./attributeTypes";
import { UserLogin } from "./authenticationTypes";
import { parseMFACode } from "./validator";
import "./ZodExtend";

export const assetCreationSchema: ZodSchema<AssetCreationAttributes> = z.object({
  assetTag: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  nextAuditDate: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

export const userCreationSchema: ZodSchema<UserCreationAttributes> = z.object({
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

export const locationCreationSchema: ZodSchema<LocationCreationAttributes> = z.object({
  locationName: z.string(),
  geoLocation: z.any().optional(),
  primaryLocation: z.boolean(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict().exactOptions();

export const mfaCodeSchema = z.union([
  z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  z.object({
    code: z.string().length(6).refine((val) => /^[0-9]*$/.test(val)),
  }).strict(),
]);

export const userLoginSchema: ZodSchema<UserLogin> = z.object({
  username: z.string(),
  password: z.string(),
  mfaCode: z.string().refine((val) => parseMFACode(val)).optional(),
}).strict().exactOptions();
