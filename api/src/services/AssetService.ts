import Asset, { init } from "../database/models/asset.model";
import { AssetAttributes } from "../utils/types/attributeTypes";
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
    init();
  }

  public async create(data: AssetAttributes): Promise<boolean> {
    const asset = await Asset.create(data);

    if (asset.id <= 0) {
      return false;
    }
    return true;
  }

  public async update(
    assetId: number,
    data: AssetAttributes
  ): Promise<boolean> {
    const [affectedCount] = await Asset.update(data, { where: { id: assetId } });

    if (affectedCount <= 0) {
      return false;
    }
    return true;
  }

  public async delete(assetId: number): Promise<boolean> {
    const deletedCount = await Asset.destroy({ where: { id: assetId } });

    if (deletedCount <= 0) {
      return false;
    }

    return true;
  }
}

export default AssetService;
