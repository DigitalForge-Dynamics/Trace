import User from "../database/models/user.model";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";
import * as argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { GenericClaimStructure, TokenUse } from "../utils/types/authenticationTypes";

class AuthService {
  public async getUser(requestedUser: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { username: requestedUser } });

    if (!user) {
      return null;
    }
    return user;
  }

  public async createUser(data: UserAttributes): Promise<boolean> {
    const isCreated = await User.create(data);

    if (isCreated.id <= 0) {
      return false;
    }
    return true;
  }

  public generateIdToken(user: UserAttributes): string {
    const tokenClaims = this.generateClaims('id');
    return jwt.sign(
      {
        ...tokenClaims,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
      },
      this.getJWTSecretKey(),
      { algorithm: "HS512" }
    );
  }

  public generateAccessToken(scopes: Scope[]): string {
    const tokenClaims = this.generateClaims('access');
    return jwt.sign(
      {
        ...tokenClaims,
        scope: scopes,
      },
      this.getJWTSecretKey(),
      { algorithm: "HS512" }
    );
  }
  
  private generateRefreshToken(): string {
    const tokenClaims = this.generateClaims('refresh');
    return jwt.sign(
      tokenClaims,
      this.getJWTSecretKey(),
      { algorithm: "HS512" }
    )
  }

  public async hashPassword(password: string): Promise<string> {
    const hashedPasswordOutput = await argon2.hash(password);
    return hashedPasswordOutput;
  }

  public async passwordVerification(
    hashedPassword: string,
    loginRequestPassword: string
  ): Promise<boolean> {
    const isPasswordValid = await argon2.verify(
      hashedPassword,
      loginRequestPassword
    );
    return isPasswordValid;
  }

  public getJWTSecretKey(): string {
    let signingKey = process.env.EXPRESS_SECRET_KEY;

    if (!signingKey) {
      signingKey = crypto.randomBytes(256).toString('base64');
      process.env.EXPRESS_SECRET_KEY = signingKey;
      return signingKey;
    }
    return signingKey;
  }

  private generateClaims(token_use: TokenUse): GenericClaimStructure {
    const timestamp = Math.floor(Date.now() / 1000);
    return {
      iss: "urn:trace-api",
      sub: crypto.randomUUID(),
      aud: "urn:trace-consumer",
      exp: timestamp + 60 * 60,
      iat: timestamp,
      token_use,
    };
  }
}

export default AuthService;
