import { PaginationResult } from "../../utils/Paginator";
import { AssetCreationAttributes, AssetStoredAttributes } from "../../utils/types/attributeTypes";

export const testCreationAsset: AssetCreationAttributes = {
  assetTag: "testAssetTag",
  name: "testAsset",
  serialNumber: "testSerialNumber",
  modelNumber: "testModelNumber",
  nextAuditDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testStoredAsset: AssetStoredAttributes = {
	id: 1,
	assetTag: testCreationAsset.assetTag,
	name: testCreationAsset.name,
	serialNumber: testCreationAsset.serialNumber!,
	modelNumber: testCreationAsset.modelNumber!,
	nextAuditDate: testCreationAsset.nextAuditDate!,
	createdAt: testCreationAsset.createdAt!,
	updatedAt: testCreationAsset.updatedAt!,
};

export const testPaginationAssets: PaginationResult<AssetStoredAttributes> = {
  lastPage: 1,
  totalRecords: 3,
  hasMorePages: false,
  data: [
    {
      id: 1,
      assetTag: "testAssetTag1",
      name: "testAsset1",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      assetTag: "testAssetTag2",
      name: "testAsset2",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      assetTag: "testAssetTag3",
      name: "testAsset3",
      serialNumber: "",
      modelNumber: "",
      nextAuditDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};
