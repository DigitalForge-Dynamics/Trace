import sequelize, { Op } from "sequelize";
import Asset, { init } from "../database/models/asset.model";
import {
  RecentlyAddedInventory,
  TotalInventoryCount,
  TotalInventoryStatuses,
} from "../utils/types/attributeTypes";

interface IDashboardService {
  getTotalInventoryCount(): Promise<TotalInventoryCount[]>;
  getTotalInventoryStatus(): Promise<TotalInventoryStatuses>;
  getRecentlyAddedInventory(): Promise<RecentlyAddedInventory>;
}

class DashboardService implements IDashboardService {
  constructor() {
    init();
  }

  public async getTotalInventoryCount(): Promise<TotalInventoryCount[]> {
    const assetTotalCount = await Asset.findAndCountAll();
    return [{ assets: assetTotalCount.count }];
  }

  public async getTotalInventoryStatus(): Promise<TotalInventoryStatuses> {
    const assetStatus = await Asset.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "total"],
      ],
      group: "status",
    }) as Array<unknown> as TotalInventoryStatuses;
    return assetStatus;
  }

  public async getRecentlyAddedInventory(): Promise<RecentlyAddedInventory> {
    return await Asset.findAll({
      where: {
        createdAt: {
          [Op.gt]: new Date(Date.now() - 30 * 24 * 3600 * 1000),
        },
      },
    });
  }
}

export default DashboardService;
