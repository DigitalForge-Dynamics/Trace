import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import DashboardService from "../services/DashboardService";
import { DashboardData } from "../utils/types/attributeTypes";

export default class DashboardController extends ErrorController {
  private readonly dashboardService = new DashboardService();

  public async getDashboardStats(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboardStats: DashboardData = {
        totalInventoryStatuses:
          await this.dashboardService.getTotalInventoryStatus(),
        totalInventoryCount:
          await this.dashboardService.getTotalInventoryCount(),
        recentlyAddedInventory:
          await this.dashboardService.getRecentlyAddedInventory(),
      };

      res.send(dashboardStats).status(200).end();
    } catch (err) {
      next(err);
    }
  }
}
