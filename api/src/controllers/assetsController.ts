import { Request, Response } from "express";
import Asset from "../database/models/asset.model";
import { AssetAttributes } from "../utils/types/attributeTypes";

class AssetController {
  async create(data: AssetAttributes): Promise<Boolean> {
    const returnedValues = await Asset.create(data);

    if (returnedValues.id <= 0) {
      return false;
    }
    return true;
  }

  async findAll(): Promise<Asset[]> {
    const returnedAssets = await Asset.findAll();
    return returnedAssets;
  }

  async findOne(assetId: number): Promise<Asset | null> {
    const returnedAsset = await Asset.findByPk(assetId);

    if (!returnedAsset) {
      return null;
    }
    return returnedAsset;
  }

  async update(req: Request, res: Response) {}

  async delete(req: Request, res: Response) {}
}

export default AssetController;
