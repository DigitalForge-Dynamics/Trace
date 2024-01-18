import Asset from "../database/models/Asset.model";
import { AssetAttributes } from "../utils/types/AttributeTypes";
import { BaseService } from "./BaseService";
import { IService } from "./IService";

interface IAssetService extends IService<Asset> {
  create(data: AssetAttributes): Promise<boolean>;
  update(assetId: number, data: AssetAttributes): Promise<boolean>;
  delete(assetId: number): Promise<boolean>;
}

class AssetService
  extends BaseService<Asset>
  implements IAssetService
{
  constructor() {
    super(Asset);
  }

  public async create(data: AssetAttributes): Promise<boolean> {
    const isCreated = await Asset.create(data);

    if (isCreated.id <= 0) {
      return false;
    }
    return true;
  }

  public async update(
    assetId: number,
    data: AssetAttributes
  ): Promise<boolean> {
    const isUpdated = await Asset.update(data, { where: { id: assetId } });

    if (isUpdated[0] <= 0) {
      return false;
    }
    return true;
  }

  public async delete(assetId: number): Promise<boolean> {
    const isDeleted = await Asset.destroy({ where: { id: assetId } });

    if (isDeleted <= 0) {
      return false;
    }

    return true;
  }
}

export default AssetService;
