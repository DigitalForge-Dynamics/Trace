import { ZodSchema, z } from "zod";
import { AssetCreationAttributes, UserCreationAttributes, LocationCreationAttributes } from "./attributeTypes";
import { UserLogin } from "./authenticationTypes";
import "./ZodExtend";
export declare const assetCreationSchema: ZodSchema<AssetCreationAttributes>;
export declare const userCreationSchema: ZodSchema<UserCreationAttributes>;
export declare const locationCreationSchema: ZodSchema<LocationCreationAttributes>;
export declare const mfaCodeSchema: z.ZodUnion<[z.ZodEffects<z.ZodString, string, string>, z.ZodObject<{
    code: z.ZodEffects<z.ZodString, string, string>;
}, "strict", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>]>;
export declare const userLoginSchema: ZodSchema<UserLogin>;
