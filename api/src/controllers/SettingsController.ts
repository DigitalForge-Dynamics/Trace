import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import SettingsService from "../services/SettingsService";

export default class SettingsController extends ErrorController {
  private readonly settingsService = new SettingsService();

  public healthCheck(_: Request<{}>, res: Response, next: NextFunction) {
    try {
      const applicationHealth = this.settingsService.healthCheck();

      Logger.info("Application Health Check successfully requested");
      res.send(applicationHealth).status(200).end();
    } catch (err) {
      next(err);
    }
  }
}
