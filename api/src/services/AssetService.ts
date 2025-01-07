import { AssetCreationAttributes } from "trace_common";
import { AssetRepository } from "../database/repositories/asset.repository";
import { DeleteResult, ObjectLiteral, UpdateResult } from "typeorm";

interface IAssetService {
  getAllAssets(): Promise<ObjectLiteral[]>;
  getIndividualAsset(id: number): Promise<ObjectLiteral | null>;
  createAsset(data: AssetCreationAttributes): ObjectLiteral;
  updateAsset(id: number, data: AssetCreationAttributes): Promise<UpdateResult>;
  deleteAsset(id: number): Promise<DeleteResult>;
}

export default class AssetService implements IAssetService {
  // Pending Pagination adaptation from Sequelise to typeorm
  // Incorrect Type
  public async getAllAssets(): Promise<ObjectLiteral[]> {
    return await AssetRepository.find();
  }

  // Incorrect Type
  public async getIndividualAsset(id: number): Promise<ObjectLiteral | null> {
    return await AssetRepository.findOneBy({ where: { id: id } });
  }

  // Incorrect Type
  public createAsset(data: AssetCreationAttributes): ObjectLiteral {
    return AssetRepository.create(data);
  }

  // Incorrect Type
  public async updateAsset(
    id: number,
    data: AssetCreationAttributes
  ): Promise<UpdateResult> {
    const isValidRecord = await this.getIndividualAsset(id);

    // Need to adjust handlig based on new type alignment
    if (!isValidRecord) {
        console.error("Unable to find valid record to update")
    }

    return await AssetRepository.update({ where: { id: id } }, data);
  }

  // Incorrect Type
  public async deleteAsset(id: number): Promise<DeleteResult> {
    const isValidRecord = await this.getIndividualAsset(id);

    // Need to adjust handling based on new type alignment
    if (!isValidRecord) {
        console.error("Unable to find valid record to delete")
    }

    return await AssetRepository.delete({ where: { id: id } });
  }
}

// Previous Asset Service implementation with Sequelise (Delete on completion of PR)

// import Asset, { init } from "../database/models/asset.model";
// import { AssetCreationAttributes } from "../utils/types/attributeTypes";
// import { BaseService } from "./BaseService";
// import { IService } from "./IService";

// interface IAssetService extends IService<Asset> {
//   create(data: AssetCreationAttributes): Promise<boolean>;
//   update(assetId: number, data: AssetCreationAttributes): Promise<boolean>;
//   delete(assetId: number): Promise<boolean>;
// }

// class AssetService
//   extends BaseService<Asset>
//   implements IAssetService
// {
//   constructor() {
//     super(Asset);
//     init();
//   }

//   public async create(data: AssetCreationAttributes): Promise<boolean> {
//     const asset = await Asset.create(data);

//     if (asset.id <= 0) {
//       return false;
//     }
//     return true;
//   }

//   public async update(
//     assetId: number,
//     data: AssetCreationAttributes
//   ): Promise<boolean> {
//     const [affectedCount] = await Asset.update(data, { where: { id: assetId } });

//     if (affectedCount <= 0) {
//       return false;
//     }
//     return true;
//   }

//   public async delete(assetId: number): Promise<boolean> {
//     const deletedCount = await Asset.destroy({ where: { id: assetId } });

//     if (deletedCount <= 0) {
//       return false;
//     }

//     return true;
//   }
// }

// export default AssetService;
