import type { AssetCreationAttributes, UserCreationAttributes, LocationCreationAttributes } from "./attributeTypes";
import type { UserLogin } from "./authenticationTypes";
export type Validator<T> = (data: unknown) => T;
export declare const validateAsset: Validator<AssetCreationAttributes>;
export declare const validateUser: Validator<UserCreationAttributes>;
export declare const validateLocation: Validator<LocationCreationAttributes>;
export declare const validateUserLogin: Validator<UserLogin>;
export declare const parseMFACode: Validator<string>;
