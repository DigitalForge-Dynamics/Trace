import { DatabaseStrategyFactory } from "../config/databaseStrategyFactory";
import { DatabaseManager } from "../databaseManager";
import { Asset } from "../entity/asset.entity";

const strategy = new DatabaseStrategyFactory().createStrategy();
const databaseManager = new DatabaseManager(strategy);

export const AssetRepository = databaseManager.getRepository(Asset).extend({
  /**
   * Retrieves total assets within database
   * @returns {Promise<number>} Returns total asset count.
   */
  getTotalAssetCount(): Promise<number> {
    return this.createQueryBuilder("asset").getCount();
  },
});
