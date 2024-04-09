import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import SystemService from "../services/SystemService";

export default class SystemController extends ErrorController {
  private readonly systemService = new SystemService();

  public healthCheck(_: Request<{}>, res: Response, next: NextFunction) {
    try {
      const applicationHealth = this.systemService.healthCheck();

      Logger.info("Application Health Check successfully requested");
      res.send(applicationHealth).status(200).end();
    } catch (err) {
      next(err);
    }
  }
}
