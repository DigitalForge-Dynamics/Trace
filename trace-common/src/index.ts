import { type Validator, validateAsset, validateLocation, validateUser, validateUserLogin } from "./validator";
import type {
	AssetCreationAttributes, UserCreationAttributes, LocationCreationAttributes,
	AssetStoredAttributes, UserStoredAttributes, LocationStoredAttributes,
	WithMfa, WithUuid, Scope, HealthCheckType,
} from "./attributeTypes";
import type {
	GenericClaimStructure, TokenUse, Tokens, UserLogin,
	RefreshTokenPayload, AccessTokenPayload, IdTokenPayload, TokenPayload,
} from "./authenticationTypes";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

// Converts from `[K]?: T | undefined` to `[K]?: T`.
export type NonUndefinedOptional<T extends object> = {
  [K in keyof T]: Omit<T, K> extends T ?
    Exclude<T[K], undefined> : T[K];
};

export {
	// Validation
	Validator,
	validateAsset,
	validateLocation,
	validateUser,
	validateUserLogin,
	// Attribute Types
	AssetCreationAttributes,
	UserCreationAttributes,
	LocationCreationAttributes,
	AssetStoredAttributes,
	UserStoredAttributes,
	LocationStoredAttributes,
	WithMfa,
	WithUuid,
	Scope,
	HealthCheckType,
	// Authentication Types
	GenericClaimStructure,
	TokenUse,
	Tokens,
	UserLogin,
	RefreshTokenPayload,
	AccessTokenPayload,
	IdTokenPayload,
	TokenPayload,
};
