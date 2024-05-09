import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import { parseMFACode, validateUser, validateUserLogin } from "../utils/Validator";
import ErrorController from "./ErrorController";
import Logger from "../utils/Logger";
import { TokenPayload, TokenUse, UserLogin } from "../utils/types/authenticationTypes";
import AuthService from "../services/AuthenticationService";
import SystemService from "../services/SystemService";
import { getRedisClient } from "../database/config/redisClient";
import { UserCreationAttributes, UserStoredAttributes, WithUuid } from "../utils/types/attributeTypes";
import { encodeBase32 } from "../utils/Encodings";

export default class AuthenticationContoller extends ErrorController {
  private readonly userService = new UserService();
  private readonly authService = new AuthService();
  private readonly systemService = new SystemService();

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const data: UserLogin = validateUserLogin(req.body);
      const settings = await this.systemService.loadSettings();
      if (!settings.setup && data.username !== "TRACE_SETUP") {
        Logger.error("System has not been initialised.");
        throw ErrorController.ForbiddenError();
      }

      const userDetails = await this.userService.getUser(data.username);
      if (userDetails === null) {
        Logger.error(`User does not exist: '${data.username}'`);
        throw ErrorController.ForbiddenError();
      }

      if (!userDetails.isActive) {
        Logger.error(`Attempted to sign in to inactive account: '${userDetails.username}'`);
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
        if (data.mfaCode === undefined) {
          Logger.error(`Missing mfa code for user '${data.username}' with MFA enabled.`);
          throw ErrorController.ForbiddenError();
        }
        const isValidMfa: boolean = this.authService.mfaVerification(
          userDetails.mfaSecret,
          data.mfaCode,
        );
        if (!isValidMfa) {
          Logger.error(`Invalid MFA code provided for user '${data.username}`);
          throw ErrorController.ForbiddenError();
        }
      }

      if (data.username === "TRACE_SETUP") {
        Logger.info("Disabling the 'TRACE_SETUP' account.");
        await this.systemService.setSettings({ ...settings, setup: true });
        const isSuccess = await this.userService.disableUser(data.username);
        if (!isSuccess) {
          Logger.error("Failure to disable 'TRACE_SETUP' user.");
          throw ErrorController.InternalServerError();
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

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data: UserCreationAttributes = validateUser(req.body);

      const ensureUniqueUser = await this.userService.getUser(data.username);
      if(ensureUniqueUser !== null) {
        throw ErrorController.BadRequestError("User Already Exists");
      }

      const userData: WithUuid<UserCreationAttributes> = {
        ...data,
        password: await this.authService.hashPassword(data.password),
        uuid: this.authService.generateUuid(data.username),
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
      if (!userAttributes.isActive) {
        throw ErrorController.ForbiddenError("User disabled.");
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
      const userDetails: UserStoredAttributes | null = await this.userService.getUserByUuid(user.sub);
      if (userDetails === null) {
        Logger.error(`Unable to find user within database with Uuid '${user.sub}'`);
        throw ErrorController.ForbiddenError();
      }
      if (userDetails.mfaSecret !== null) {
        Logger.error(`User with Uuid ${userDetails.uuid} attempted to override MFA secret within initMfa.`);
        throw ErrorController.ForbiddenError();
      }

      const redis = getRedisClient();
      const secretB32: string = encodeBase32(this.authService.generateSecret(20));
      await redis.set(userDetails.uuid, secretB32);
      Logger.info(`Successfully generated MFA secret for user with Uuid: ${user.sub}`);
      res.status(200).send(secretB32).end();
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
      const secretB32 = await redis.get(user.sub);
      if (secretB32 === null) {
        Logger.error("Attempted to enable MFA for an account that has not initialised it.");
        throw ErrorController.BadRequestError();
      }
      await redis.del(user.sub);
      const userDetails: UserStoredAttributes | null = await this.userService.getUserByUuid(user.sub);
      if (userDetails === null) {
        Logger.error(`Unable to find user within database with Uuid '${user.sub}'`);
        throw ErrorController.ForbiddenError();
      }
      if (userDetails.mfaSecret !== null) {
        Logger.error(`User ${userDetails.username} attempted to override MFA secret within enableMfa.`);
        throw ErrorController.ForbiddenError();
      }
      const isValidMfa: boolean = this.authService.mfaVerification(secretB32, code);
      if (!isValidMfa) {
        Logger.error(`User ${userDetails.username} provided incorrect token. Rejecting to not lock-out.`);
        throw ErrorController.ForbiddenError();
      }
      const valid = await this.userService.setMfaSecret(userDetails.username, secretB32);
      if (!valid) {
        Logger.error(`Unexpected error when setting MFA secret for user '${userDetails.username}'`);
        throw ErrorController.InternalServerError();
      }
      Logger.info(`Successfully enabled MFA for user: ${userDetails.username}`);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
