import { AssetCreationAttributes } from "trace_common";
import { AssetRepository } from "../database/repositories/asset.repository";
import { BaseService } from "./BaseService";
import { Asset } from "../database/entity/asset.entity";
import Logger from "../utils/Logger";

interface IAssetService {
  getAllAssets(): Promise<Asset[]>;
  getIndividualAsset(id: number): Promise<Asset>;
  createAsset(data: AssetCreationAttributes): Promise<number>;
  updateAsset(id: number, data: AssetCreationAttributes): Promise<number>;
  deleteAsset(id: number): Promise<number>;
}

export default class AssetService
  extends BaseService<Asset>
  implements IAssetService
{
  constructor() {
    super(AssetRepository);
  }
  // Pending Pagination adaptation from Sequelise to typeorm
  // Incorrect Type
  public async getAllAssets(): Promise<Asset[]> {
    try {
      return await this.findAll();
    } catch (error) {
      Logger.error("Unexpected error occured at GetAllAssets Service");
      throw new Error("Unexpected error occured");
    }
  }

  public async getIndividualAsset(id: number): Promise<Asset> {
    try {
      const asset = await this.findById(id);

      if (!asset) {
        Logger.error(`Unable to find asset with the following ID: ${id}`);
        // Need to find a new Error Handler way
        throw new Error(`Asset with ID ${id} not found.`);
      }

      return asset;
    } catch (error) {
      Logger.error("Unexpected error occured at GetIndividualAssets Service");
      throw new Error("Unexpected error occured.");
    }
  }

  public async createAsset(data: AssetCreationAttributes): Promise<number> {
    try {
      // Need a validator here

      // Need a mapper here

      const assetIdentifier = await AssetRepository.createAsset(data);

      if (assetIdentifier.identifiers.length <= 0) {
        Logger.error(`Unable to create new asset`);
        throw new Error("Unable to create new Asset.");
      }

      // Need to fix the types
      return assetIdentifier.identifiers[0] as unknown as number;
    } catch (error) {
      Logger.error("Unexpected error occured at CreateAsset Service");
      throw new Error("Unexpected error occured.");
    }
  }

  public async updateAsset(
    id: number,
    data: AssetCreationAttributes
  ): Promise<number> {
    try {
      // Need a validator here

      // Need a mapper here

      const { affected } = await AssetRepository.updateAsset(id, data);

      if (affected === undefined || affected <= 0) {
        Logger.error(`Unable to update asset with the following ID: ${id}`);
        throw new Error(`Unable to update Asset with the Id: ${id}`);
      }

      return affected;
    } catch (error) {
      Logger.error("Unexpected error occured at UpdateAsset Service");
      throw new Error("Unexpected error occured.");
    }
  }

  public async deleteAsset(id: number): Promise<number> {
    try {
      const { affected } = await AssetRepository.deleteAsset(id);

      if (affected == undefined || affected <= 0) {
        Logger.error(`Unable to delete asset with the following ID: ${id}`);
        throw new Error(`Unable to delete Asset with the Id: ${id}`);
      }

      return affected;
    } catch (error) {
      Logger.error("Unexpected error occuered at DeleteAsset Service");
      throw new Error("Unexpected error occured");
    }
  }
}
