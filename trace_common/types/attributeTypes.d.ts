import { UUID } from "./misc";
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
type StoredAttributes<TCreation> = {
    id: number;
} & {
    [K in keyof TCreation]-?: undefined extends TCreation[K] ? Exclude<TCreation[K], undefined> | null : TCreation[K];
};
export interface AssetStoredAttributes extends StoredAttributes<AssetCreationAttributes> {
}
export interface UserStoredAttributes extends StoredAttributes<UserCreationAttributes> {
    mfaSecret: string | null;
    uuid: UUID;
}
export interface LocationStoredAttributes extends StoredAttributes<LocationCreationAttributes> {
}
export type WithUuid<T> = T & {
    uuid: UUID;
};
export type WithMfa<T> = T & {
    mfaSecret: string;
};
export declare enum Scope {
    READ = "TRACE_READ",
    ASSET_CREATE = "TRACE_ASSET_CREATE",
    ASSET_DELETE = "TRACE_ASSET_DELETE",
    ASSET_ASSIGN = "TRACE_ASSET_ASSIGN",
    ASSET_RETURN = "TRACE_ASSET_RETURN",
    ASSET_AUDIT = "TRACE_ASSET_AUDIT",
    ASSET_MOVE = "TRACE_ASSET_MOVE",
    USER_CREATE = "TRACE_USER_CREATE",
    USER_DELETE = "TRACE_USER_DELETE",
    USER_AUDIT = "TRACE_USER_AUDIT",
    LOCATION_CREATE = "TRACE_LOCATION_CREATE",
    LOCATION_DELETE = "TRACE_LOCATION_DELETE",
    LOCATION_AUDIT = "TRACE_LOCATION_AUDIT",
    SETTINGS_ADMIN = "TRACE_SETTINGS_ADMIN"
}
export type HealthCheckType = {
    uptime: string;
    message: string;
    timestamp: Date;
};
export {};
