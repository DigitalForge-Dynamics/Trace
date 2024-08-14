import sequelize, { Op } from "sequelize";
import Asset, { init } from "../database/models/asset.model";
import {
  RecentlyAddedInventory,
  TotalInventoryCount,
  TotalInventoryStatuses,
  Status,
} from "../utils/types/attributeTypes";

interface IDashboardService {
  getTotalInventoryCount(): Promise<TotalInventoryCount>;
  getTotalInventoryStatus(): Promise<TotalInventoryStatuses>;
  getRecentlyAddedInventory(): Promise<RecentlyAddedInventory>;
}

class DashboardService implements IDashboardService {
  constructor() {
    init();
  }

  public async getTotalInventoryCount(): Promise<TotalInventoryCount> {
    const assetTotalCount = await Asset.findAndCountAll();
    return { assets: assetTotalCount.count };
  }

  public async getTotalInventoryStatus(): Promise<TotalInventoryStatuses> {
    const assetStatus = await Asset.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "total"],
      ],
      group: "status",
    }) as Array<unknown> as Array<{ status: Status; total: number}>;
    const initial: TotalInventoryStatuses = {
      [Status.IN_MAINTAINCE]: 0,
      [Status.SERVICEABLE]: 0,
      [Status.UNKNOWN]: 0,
      [Status.UNSERVICEABLE]: 0,
    };
    return assetStatus.reduce(
      (prev, current) => {
        const { total } = JSON.parse(JSON.stringify(current)) as { total: string };
        return {...prev, [current.status]: parseInt(total) };
      },
      initial,
    );

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
