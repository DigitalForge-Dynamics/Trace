import { Request, Response } from "express";
import { UserAttributes } from "../utils/types/attributeTypes";
import AuthService from "../services/AuthenticationService";

type GenericClaimStructure = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
};

interface UserLogin {
  username: string;
  password: string;
}

export default class AuthenticationContoller {
  private authService = new AuthService();

  public async signIn(req: Request, res: Response) {
    try {
      const data: UserLogin = req.body;
      const userDetails = await this.authService.getUser(data.username);
      if (!userDetails) {
        console.log("User not found - Error 400");
        throw new Error("User not found - Error 400");
      }

      const isValid = await this.authService.passwordVerification(
        userDetails.password,
        data.password
      );

      if (!isValid) {
        console.log("Not valid password - Error 403");
        throw new Error("Not valid password - Error 403");
      }

      res.status(200).send({
        idToken: this.authService.generateIdToken(userDetails),
        accessToken: this.authService.generateAccessToken(userDetails.scopes),
      });
    } catch (err) {
      res.send(err);
    }
  }

  public async signUp(req: Request, res: Response) {
    try {
      const data: UserAttributes = req.body;

      const userData: UserAttributes = {
        ...data,
        password: await this.authService.hashPassword(data.password),
      };

      const user = await this.authService.createUser(userData);

      if (!user) {
        console.log(`Unable to create new asset - Error Code 500`);
        throw new Error(`Unable to create new asset - Error Code 500`);
      }

      res.status(204).end();
    } catch (err) {
      res.send(err);
    }
  }
}
