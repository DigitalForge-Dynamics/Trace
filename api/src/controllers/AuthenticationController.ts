import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import { parseMFACode, validateUser, validateUserLogin } from "../utils/Validator";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import { TokenPayload, TokenUse, UserLogin } from "../utils/types/authenticationTypes";
import AuthService from "../services/AuthenticationService";
import { getRedisClient } from "../database/config/redisClient";
import { UserCreationAttributes, UserStoredAttributes } from "../utils/types/attributeTypes";

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

      if (userDetails.mfaSecret !== null) {
        Logger.warn(`MFA Secret:${userDetails.mfaSecret}|`);
        if (data.mfaCode === undefined) {
          Logger.error(`Missing mfa code for user '${data.username}' with MFA enabled.`);
          throw ErrorController.ForbiddenError();
        }
        const isValidMfa = await this.authService.mfaVerification(
          userDetails.mfaSecret,
          data.mfaCode,
        );
        if (!isValidMfa) {
          Logger.error(`Invalid MFA code provided for user '${data.username}`);
          throw ErrorController.ForbiddenError();
        }
      }

      Logger.info('User signed in successfully');
      res.status(200).json({
        idToken: this.authService.generateIdToken(userDetails),
        accessToken: this.authService.generateAccessToken(userDetails.scope, userDetails.username),
        refreshToken: this.authService.generateRefreshToken(userDetails.username),
      }).end();
    } catch (err) {
      next(err);
    }
  }

  public async signUp(req: Request<{}>, res: Response, next: NextFunction) {
    try {
      const data: UserCreationAttributes = validateUser(req.body);

      const ensureUniqueUser = await this.userService.getUser(data.username);
      if(ensureUniqueUser !== null) {
        throw ErrorController.BadRequestError("User Already Exists");
      }

      const userData: UserCreationAttributes = {
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
      const accessToken = this.authService.generateAccessToken(scope, user.username);
      Logger.info(`Successfully refreshed token for: ${user.username}`);
      res.status(200).send(accessToken).end();
    } catch (err) {
      next(err);
    }
  }

  public async initMfa(_: Request, res: Response, next: NextFunction) {
    try {
      const user: TokenPayload | undefined = res.locals.user;
      if (user === undefined) {
        Logger.error("Missing user locals within initMFa controller.");
        throw ErrorController.InternalServerError();
      }
      if (user.token_use !== TokenUse.Access) {
        throw ErrorController.ForbiddenError("Unexpected token type.");
      }
      const userDetails: UserStoredAttributes | null = await this.userService.getUser(user.sub);
      if (userDetails === null) {
        throw ErrorController.ForbiddenError();
      }
      if (userDetails.mfaSecret !== undefined) {
        Logger.error(`User ${user.sub} attempted to override MFA secret.`);
        throw ErrorController.ForbiddenError();
      }

      const redis = getRedisClient();
      const secret = this.authService.generateSecret(20);
      await redis.set(user.sub, secret);
      Logger.info(`Successfully generated MFA secret for user: ${user.sub}`);
      res.status(200).send(secret).end();
    } catch (err) {
      next(err);
    }
  }

  public async enableMfa(req: Request, res: Response, next: NextFunction) {
    try {
      const user: TokenPayload | undefined = res.locals.user;
      if (user === undefined) {
        Logger.error("Missing user locals within enableMFa controller.");
        throw ErrorController.InternalServerError();
      }
      if (user.token_use !== TokenUse.Access) {
        throw ErrorController.ForbiddenError("Unexpected token type.");
      }
      const code = parseMFACode(req.body);

      const redis = getRedisClient();
      const secret = await redis.get(user.sub);
      if (secret === null) {
        Logger.error("Attempted to enable MFA for an account that has not initialised it.");
        throw ErrorController.BadRequestError();
      }
      await redis.del(user.sub);
      const userDetails: UserStoredAttributes | null = await this.userService.getUser(user.sub);
      if (userDetails === null) {
        throw ErrorController.ForbiddenError();
      }
      if (userDetails.mfaSecret !== undefined) {
        Logger.error(`User ${user.sub} attempted to override MFA secret.`);
        throw ErrorController.ForbiddenError();
      }
      if (!this.authService.mfaVerification(secret, code)) {
        Logger.error(`User ${user.sub} provided incorrect token. Rejecting to not lock-out.`);
        throw ErrorController.ForbiddenError();
      }
      const valid = await this.userService.setMfaSecret(userDetails.username, secret);
      if (!valid) {
        throw ErrorController.InternalServerError();
      }
      Logger.info(`Successfully enabled MFA for user: ${userDetails.username}`);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
