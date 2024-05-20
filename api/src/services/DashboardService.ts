import sequelize, { Op } from "sequelize";
import Asset, { init } from "../database/models/asset.model";
import { Status } from "../utils/types/attributeTypes";

interface IDashboardService {
  getTotalInventoryCount(): Promise<number>;
  getTotalInventoryStatus(): Promise<[Status, number][]>;
  getRecentlyAddedInventory(): Promise<Asset[]>;
}

class DashboardService implements IDashboardService {
  constructor() {
    init();
  }

  public async getTotalInventoryCount(): Promise<number> {
    const total = await Asset.findAndCountAll();

    if (total.count < 0) {
      return 0;
    }

    return total.count;
  }

  public async getTotalInventoryStatus(): Promise<[Status, number][]> {
    const status = await Asset.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "status_count"],
      ],
      group: "status",
    });
    return status as any;
  }

  public async getRecentlyAddedInventory(): Promise<Asset[]> {
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
