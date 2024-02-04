import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import ErrorController from "./ErrorController";
import { UserAttributes } from "../utils/types/attributeTypes";
import {
  generateSignedJwt,
  hashPassword,
  verifyPassword,
} from "../utils/tokenService";

export default class AuthController extends ErrorController {
  private authService = new AuthService();

  public async signin(req: Request, res: Response) {
    try {
      const data: UserAttributes = req.body;

      const userDetails = await this.authService.getUser(data.username);

      if (!userDetails) {
        console.log("User not found - Error 400");
        throw new Error("User not found - Error 400");
      }
      const isValid = await verifyPassword(userDetails.password, data.password);

      if (!isValid) {
        console.log("Not valid password - Error 403");
        throw new Error("Not valid password - Error 403");
      }
      const token = await generateSignedJwt(
        userDetails.id as number,
        userDetails.scopes
      );
      res.status(200).send({
        accessToken: token,
        userId: userDetails.id,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
    } catch (err) {
      res.send(err);
    }
  }

  public async signup(req: Request, res: Response) {
    try {
      const requestData: UserAttributes = req.body;

      // Temp work around
      const userData: UserAttributes = {
        ...requestData,
        password: await hashPassword(requestData.password),
      };

      const user = await this.authService.createUser(userData);

      if (!user) {
        console.log(`Unable to create new asset - Error Code 500`);
        throw new Error(`Unable to create new asset - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.status(404).send(err);
    }
  }
}
