import { NextFunction, Request, Response } from "express";
import { UserAttributes } from "../utils/types/attributeTypes";
import AuthService from "../services/AuthenticationService";
import { ajv } from "../utils/Validator";
import { UserLogin } from "../utils/types/authenticationTypes";
import ErrorController from "./ErrorController";

export default class AuthenticationContoller extends ErrorController {
  private authService = new AuthService();

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const data: UserLogin = req.body;
      const userDetails = await this.authService.getUser(data.username);
      if (!userDetails) {
        console.log("User not found - Error 400");
        throw ErrorController.BadRequestError("User not found");
      }

      const isValid = await this.authService.passwordVerification(
        userDetails.password,
        data.password
      );

      if (!isValid) {
        console.log("Not valid password - Error 403");
        throw ErrorController.ForbiddenError("Not valid password")
      }

      res.status(200).send({
        idToken: this.authService.generateIdToken(userDetails),
        accessToken: this.authService.generateAccessToken(userDetails.scopes),
      });
    } catch (err) {
      next(err);
    }
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data: UserAttributes = req.body;

      const isValidRequest = ajv.validate("user", data);
      if (!isValidRequest) {
        console.log(`Invalid Request - Error Code 400`);
        throw ErrorController.BadRequestError("Invalid Request");
      }

      const ensureUniqueUser = await this.authService.getUser(data.username);
      if(ensureUniqueUser !== null) {
        console.log(`User Already Exists - Error Code 404`);
        throw ErrorController.NotFoundError("User Already Exists");
      }

      const userData: UserAttributes = {
        ...data,
        password: await this.authService.hashPassword(data.password),
      };

      const user = await this.authService.createUser(userData);

      if (!user) {
        console.log(`Unable to create new asset - Error Code 500`);
        throw ErrorController.InternalServerError("Unable to create new asset");
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
