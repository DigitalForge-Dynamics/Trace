import type { UUID, Scope } from "./authTypes";

export interface AssetCreationAttributes {
  assetTag: string;
  name: string;
  serialNumber?: string;
  modelNumber?: string;
  status: Status;
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
type StoredAttributes<TCreation> = { id: number } & {
  [K in keyof TCreation]-?: undefined extends TCreation[K]
    ? Exclude<TCreation[K], undefined> | null
    : TCreation[K];
};

export interface AssetStoredAttributes
  extends StoredAttributes<AssetCreationAttributes> {}
export interface UserStoredAttributes
  extends StoredAttributes<UserCreationAttributes> {
  mfaSecret: string | null;
  uuid: UUID;
}
export interface LocationStoredAttributes
  extends StoredAttributes<LocationCreationAttributes> {}

export enum Status {
  SERVICEABLE = "SERVICEABLE",
  IN_MAINTAINCE = "IN_MAINTAINCE",
  UNSERVICEABLE = "UNSERVICEABLE",
  UNKNOWN = "UNKNOWN",
}

export type PaginationResult<T> = {
    lastPage: number;
    totalRecords: number;
    hasMorePages: boolean;
    data: T[];
};

export type TotalInventoryCount = {
  assets: number;
};

export type TotalInventoryStatuses = Array<{ status: Status, total: number }>;
export type RecentlyAddedInventory = AssetStoredAttributes[];

export type DashboardData = {
  totalInventoryCount: TotalInventoryCount;
  totalInventoryStatuses: TotalInventoryStatuses;
  recentlyAddedInventory: RecentlyAddedInventory;
};
