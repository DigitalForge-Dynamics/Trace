import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import ErrorController from "./ErrorController";
import { UserAttributes } from "../utils/types/attributeTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwt } from "../utils/tokenService";

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
      const isValid = await bcrypt.compare(data.password, userDetails.password);

      if (!isValid) {
        console.log("Not valid password - Error 403");
        throw new Error("Not valid password - Error 403");
      }
      // 3. Generate JWT with details
      // Missing Private Key
      const token = await generateJwt(1);
      // 4. Return token
      res.status(200).send({
        user: { id: userDetails.id, email: userDetails.email },
        accessToken: token,
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
        password: await bcrypt.hash(requestData.password, 10),
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
