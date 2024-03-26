import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "../utils/types/attributeTypes";
import AuthService from "../services/AuthenticationService";
import { validateUser, validateUserLogin } from "../utils/Validator";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import { UserLogin } from "../utils/types/authenticationTypes";

export default class AuthenticationContoller extends ErrorController {
  private readonly authService = new AuthService();

  public async signIn(req: Request<{}>, res: Response, next: NextFunction) {
    try {
      const data: UserLogin = validateUserLogin(req.body);

      const userDetails = await this.authService.getUser(data.username);
      if (!userDetails) {
        throw ErrorController.BadRequestError("User not found");
      }

      const isValid = await this.authService.passwordVerification(
        userDetails.password,
        data.password
      );

      if (!isValid) {
        throw ErrorController.ForbiddenError("Not valid password")
      }

      Logger.info('User signed in successfully');
      res.status(200).send({
        idToken: this.authService.generateIdToken(userDetails),
        accessToken: this.authService.generateAccessToken(userDetails.scopes),
      });
    } catch (err) {
      next(err);
    }
  }

  public async signUp(req: Request<{}>, res: Response, next: NextFunction) {
    try {
      const data: UserAttributes = validateUser(req.body);

      const ensureUniqueUser = await this.authService.getUser(data.username);
      if(ensureUniqueUser !== null) {
        throw ErrorController.NotFoundError("User Already Exists");
      }

      const userData: UserAttributes = {
        ...data,
        password: await this.authService.hashPassword(data.password),
      };

      const user = await this.authService.createUser(userData);

      if (!user) {
        throw ErrorController.InternalServerError("Unable to create new asset");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
