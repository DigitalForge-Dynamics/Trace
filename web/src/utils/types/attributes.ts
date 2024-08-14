export type {
  AssetCreationAttributes,
  UserCreationAttributes,
  LocationCreationAttributes,
  AssetStoredAttributes,
  UserStoredAttributes,
  LocationStoredAttributes,
  TotalInventoryCount,
  TotalInventoryStatuses,
  DashboardData,
} from "trace_common";

export { Status } from "trace_common";

export type PaginationResult<T> = {
  lastPage: number;
  totalRecords: number;
  hasMorePages: boolean;
  data: T[];
};
