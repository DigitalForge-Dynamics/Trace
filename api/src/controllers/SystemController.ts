import { NextFunction, Request, Response } from "express";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import SystemService from "../services/SystemService";
import { Scope, UserCreationAttributes, WithUuid } from "../utils/types/attributeTypes";
import UserService from "../services/UserService";
import AuthService from "../services/AuthenticationService";
import { encodeBase32 } from "../utils/Encodings";

export default class SystemController extends ErrorController {
  private readonly systemService = new SystemService();
  private readonly authService = new AuthService();
  private readonly userService = new UserService();

  public healthCheck(_: Request, res: Response, next: NextFunction) {
    try {
      const applicationHealth = this.systemService.healthCheck();

      Logger.info("Application Health Check successfully requested");
      res.send(applicationHealth).status(200).end();
    } catch (err) {
      next(err);
    }
  }

  public async setup(_: Request, res: Response, next: NextFunction) {
    try {
      const settings = await this.systemService.loadSettings();
      if (settings.setup) {
        Logger.error("Attempt to re-setup application");
        throw ErrorController.BadRequestError();
      }
      const setup_password: string = encodeBase32(this.authService.generateSecret(20)); // 32 characters
      const user: WithUuid<UserCreationAttributes> = {
        firstName: "TRACE_SETUP",
        lastName: "TRACE_SETUP",
        username: "TRACE_SETUP",
        password: await this.authService.hashPassword(setup_password),
        email: "",
        isActive: true,
        scope: [Scope.USER_CREATE],
        uuid: this.authService.generateUuid("TRACE_SETUP"),
      };
      await this.userService.createUser(user);
      // Application initial setup, provides admin access from random password to console output
      // Intentionally logged to allow the admin to sign in
      console.log(setup_password);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
