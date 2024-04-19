import { PaginationResult } from "../../utils/Paginator";
import { AssetAttributes } from "../../utils/types/attributeTypes";

export const testAsset: AssetAttributes = {
  id: 1,
  assetTag: "testAssetTag",
  name: "testAsset",
  serialNumber: "testSerialNumber",
  modelNumber: "testModelNumber",
  nextAuditDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testPaginationAssets: PaginationResult<AssetAttributes> = {
  lastPage: 1,
  totalRecords: 3,
  hasMorePages: false,
  data: [
    {
      id: 1,
      assetTag: "testAssetTag",
      name: "testAsset",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      assetTag: "testAssetTag1",
      name: "testAsset1",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      assetTag: "testAssetTag2",
      name: "testAsset2",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
