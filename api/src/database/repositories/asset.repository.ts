import { DeleteResult, InsertResult, UpdateResult } from "typeorm";
import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Asset } from "../entity/asset.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const AssetRepository = databaseManager
  .getRepository<Asset>(Asset)
  .extend({
    /**
     * Retrieves total assets within database
     * @returns {Promise<number>} Returns total asset count.
     */
    getTotalAssetCount(): Promise<number> {
      return this.createQueryBuilder("asset").getCount();
    },

    createAsset(data: Asset): Promise<InsertResult> {
      return this.createQueryBuilder("asset")
        .insert()
        .into(Asset)
        .values(data)
        .execute();
    },

    updateAsset(assetId: number, data: Asset): Promise<UpdateResult> {
      return this.createQueryBuilder("asset")
        .update(Asset)
        .set(data)
        .where("id = :id", { assetId })
        .execute();
    },

    deleteAsset(id: number): Promise<DeleteResult> {
      return this.createQueryBuilder("asset")
        .delete()
        .from(Asset)
        .where("id = :id", { id: id })
        .execute();
    },
  });
