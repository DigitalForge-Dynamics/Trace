import Asset from "../database/models/asset.model";
import { AssetAttributes } from "../utils/types/attributeTypes";

class AssetController {
  async create(data: AssetAttributes): Promise<boolean> {
    const returnedValues = await Asset.create(data);

    if (returnedValues.id <= 0) {
      return false;
    }
    return true;
  }

  async findAll(): Promise<AssetAttributes[]> {
    const returnedAssets = await Asset.findAll();
    return returnedAssets;
  }

  async findOne(assetId: number): Promise<AssetAttributes | null> {
    const returnedAsset = await Asset.findByPk(assetId);

    if (!returnedAsset) {
      return null;
    }
    return returnedAsset;
  }

  async update(assetId: number, data: AssetAttributes): Promise<boolean> {
    const returnedValue = await Asset.update(data, { where: { id: assetId } });

    if (returnedValue[0] <= 0) {
      return false;
    }
    return true;
  }

  async delete(assetId: number): Promise<boolean> {
    const isDeletedSuccessfully = await Asset.destroy({
      where: { id: assetId },
    });

    if (isDeletedSuccessfully <= 0) {
      return false;
    }
    return true;
  }
}

export default AssetController;
