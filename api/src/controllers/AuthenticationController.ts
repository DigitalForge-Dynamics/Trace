import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "../utils/types/attributeTypes";
import UserService from "../services/UserService";
import { validateUser, validateUserLogin } from "../utils/Validator";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import { TokenPayload, TokenUse, UserLogin } from "../utils/types/authenticationTypes";
import AuthService from "../services/AuthenticationService";

export default class AuthenticationContoller extends ErrorController {
  private readonly userService = new UserService();
  private readonly authService = new AuthService();

  public async signIn(req: Request<{}>, res: Response, next: NextFunction) {
    try {
      const data: UserLogin = validateUserLogin(req.body);

      const userDetails = await this.userService.getUser(data.username);
      if (userDetails === null) {
        Logger.error(`User does not exist: '${data.username}'`);
        throw ErrorController.ForbiddenError();
      }

      const isValid = await this.authService.passwordVerification(
        userDetails.password,
        data.password
      );

      if (!isValid) {
        Logger.error(`Incorrect Password for user: '${data.username}'`);
        throw ErrorController.ForbiddenError();
      }

      Logger.info('User signed in successfully');
      res.status(200).json({
        idToken: this.authService.generateIdToken(userDetails),
        accessToken: this.authService.generateAccessToken(userDetails.scope),
        refreshToken: this.authService.generateRefreshToken(userDetails.username),
      });
    } catch (err) {
      next(err);
    }
  }

  public async signUp(req: Request<{}>, res: Response, next: NextFunction) {
    try {
      const data: UserAttributes = validateUser(req.body);

      const ensureUniqueUser = await this.userService.getUser(data.username);
      if(ensureUniqueUser !== null) {
        throw ErrorController.BadRequestError("User Already Exists");
      }

      const userData: UserAttributes = {
        ...data,
        password: await this.authService.hashPassword(data.password),
      };

      const user = await this.userService.createUser(userData);

      if (!user) {
        throw ErrorController.InternalServerError("Unable to create new user");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  public async refresh(_: Request, res: Response, next: NextFunction) {
    try {
      const user: TokenPayload | undefined = res.locals.user;
      if (user === undefined) {
        Logger.error("Missing user locals within refresh controller.");
        throw ErrorController.InternalServerError();
      }
      if (user.token_use !== TokenUse.Refresh) {
        throw ErrorController.ForbiddenError("Unexpected token type.");
      }
      const userAttributes = await this.userService.getUser(user.username);
      if (userAttributes === null) {
        throw ErrorController.NotFoundError("User not found");
      }
      const { scope } = userAttributes;
      const accessToken = this.authService.generateAccessToken(scope);
      Logger.info(`Successfully refreshed token for: ${user.username}`);
      res.status(200).send(accessToken);
    } catch (err) {
      next(err);
    }
  }
}
