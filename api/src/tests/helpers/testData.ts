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

export const testPaginationAssets = {
  lastPage: 1,
  totalRecords: 3,
  hasMorePages: false,
  data: [
    {
      id: 1,
      assetTag: "testAssetTag",
      name: "testAsset",
      serialNumber: null,
      modelNumber: null,
      nextAuditDate: null,
      createdAt: "2024-04-18T20:25:51.816Z",
      updatedAt: "2024-04-18T20:25:51.816Z",
    },
    {
      id: 2,
      assetTag: "testAssetTag1",
      name: "testAsset1",
      serialNumber: null,
      modelNumber: null,
      nextAuditDate: null,
      createdAt: "2024-04-18T20:26:47.631Z",
      updatedAt: "2024-04-18T20:26:47.631Z",
    },
    {
      id: 3,
      assetTag: "testAssetTag2",
      name: "testAsset2",
      serialNumber: null,
      modelNumber: null,
      nextAuditDate: null,
      createdAt: "2024-04-18T20:26:53.547Z",
      updatedAt: "2024-04-18T20:26:53.547Z",
    },
  ],
};
