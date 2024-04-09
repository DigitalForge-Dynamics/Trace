import { AssetAttributes } from "../../utils/types/attributeTypes";

export class TestModelStatic {
  public findAndCountAll() {
    return {
      rows: [
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
      ],
      count: 2,
    };
  }
}

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
