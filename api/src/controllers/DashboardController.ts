import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import DashboardService from "../services/DashboardService";

export default class DashboardController extends ErrorController {
  private readonly dashboardService = new DashboardService();

  public async getDashboardStats(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dashboardStats = {
        totalInventoryCount:
          await this.dashboardService.getTotalInventoryCount(),
        totalInventoryStatuses:
          await this.dashboardService.getTotalInventoryStatus(),
        recentlyAddedInventory:
          await this.dashboardService.getRecentlyAddedInventory(),
      };

      res.send(dashboardStats).status(200).end();
    } catch (err) {
      next(err);
    }
  }
}
