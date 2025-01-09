import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Asset } from "../entity/asset.entity";

const factory = new DatabaseStrategyFactory();
const databaseManager = new DatabaseManager(factory.currentStrategy);

export const AssetRepository = databaseManager.getRepository<Asset>(Asset).extend({
  /**
   * Retrieves total assets within database
   * @returns {Promise<number>} Returns total asset count.
   */
  getTotalAssetCount(): Promise<number> {
    return this.createQueryBuilder("asset").getCount();
  },
});
