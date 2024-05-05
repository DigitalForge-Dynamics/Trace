import { UUID } from "crypto";

export interface AssetCreationAttributes {
  assetTag: string;
  name: string;
  serialNumber?: string;
  modelNumber?: string;
  nextAuditDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  isActive: boolean;
  scope: Scope[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LocationCreationAttributes {
  locationName: string;
  geoLocation?: JSON;
  primaryLocation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Convert optional properties from `[K]?: T` or `[K]: T | undefined`, into `[K]: T | null`.
type StoredAttributes<TCreation> = { id: number }
& { [K in keyof TCreation]-?: undefined extends TCreation[K] ? Exclude<TCreation[K], undefined> | null : TCreation[K] };

export interface AssetStoredAttributes extends StoredAttributes<AssetCreationAttributes> {}
export interface UserStoredAttributes extends StoredAttributes<UserCreationAttributes> {
  mfaSecret: string | null;
  uuid: UUID;
}
export interface LocationStoredAttributes extends StoredAttributes<LocationCreationAttributes> {}

export const enum Scope {
  READ = "TRACE_READ",
  // Asset
  ASSET_CREATE = "TRACE_ASSET_CREATE",
  ASSET_DELETE = "TRACE_ASSET_DELETE",
  ASSET_ASSIGN = "TRACE_ASSET_ASSIGN",
  ASSET_RETURN = "TRACE_ASSET_RETURN",
  ASSET_AUDIT = "TRACE_ASSET_AUDIT",
  ASSET_MOVE = "TRACE_ASSET_MOVE",
  // User
  USER_CREATE = "TRACE_USER_CREATE",
  USER_DELETE = "TRACE_USER_DELETE",
  USER_AUDIT = "TRACE_USER_AUDIT",
  // Location
  LOCATION_CREATE = "TRACE_LOCATION_CREATE",
  LOCATION_DELETE = "TRACE_LOCATION_DELETE",
  LOCATION_AUDIT = "TRACE_LOCATION_AUDIT",
}

export interface UserLoginAttributes {
  username: string;
  password: string;
}

export type JsonNetworkType<T> =
  // Types with manual reviving
  T extends Date
    ? string
    : // Carry these through
    T extends number
    ? T
    : T extends boolean
    ? T
    : T extends string
    ? T
    : T extends JSON
    ? T
    : T extends object
    ? { [K in keyof T]?: JsonNetworkType<T[K]> }
    : T extends Array<infer E>
    ? Array<JsonNetworkType<E>>
    : // Unknown case
      T;

export type HealthCheckType = {
  uptime: string;
  message: string;
  timestamp: Date;
};
