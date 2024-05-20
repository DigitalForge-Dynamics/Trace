import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import DashboardService from "../services/DashboardService";

export default class DashboardController extends ErrorController {
  private readonly dashboardService = new DashboardService();

  public async getTotalInventoryCount(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const totalCount = await this.dashboardService.getTotalInventoryCount();
      console.log(totalCount);
      res.send(totalCount).status(200).end();
    } catch (err) {
      next(err);
    }
  }

  public async getTotalInventoryStatus(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const totalStatuses =
        await this.dashboardService.getTotalInventoryStatus();
      res.send(totalStatuses).status(200).end();
    } catch (err) {
      next(err);
    }
  }

  public async getRecentlyAddedInventory(
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const recentlyAdded =
        await this.dashboardService.getRecentlyAddedInventory();

      res.send(recentlyAdded).status(200).end();
    } catch (err) {
      next(err);
    }
  }
}
