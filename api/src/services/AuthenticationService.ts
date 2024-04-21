import { Scope, UserStoredAttributes } from "../utils/types/attributeTypes";
import * as argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { GenericClaimStructure, TokenUse } from "../utils/types/authenticationTypes";

class AuthService {
  public generateIdToken(user: UserStoredAttributes): string {
    const tokenClaims = this.generateClaims(TokenUse.Id, user.username);
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

  public generateAccessToken(scopes: Scope[], username: string): string {
    const tokenClaims = this.generateClaims(TokenUse.Access, username);
    return jwt.sign(
      {
        ...tokenClaims,
        scope: scopes,
      },
      this.getJWTSecretKey(),
      { algorithm: "HS512" }
    );
  }
  
  public generateRefreshToken(username: string): string {
    const tokenClaims = this.generateClaims(TokenUse.Refresh, username);
    return jwt.sign(
      {
        ...tokenClaims,
        username,
      },
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
      signingKey = this.generateSecret(256).toString("base64");
      process.env.EXPRESS_SECRET_KEY = signingKey;
      return signingKey;
    }
    return signingKey;
  }

  private generateClaims(token_use: TokenUse, username: string): GenericClaimStructure {
    const timestamp = Math.floor(Date.now() / 1000);
    const duration_mins: number = {
      [TokenUse.Access]: 2,
      [TokenUse.Id]: 60,
      [TokenUse.Refresh]: 60,
    }[token_use];
    return {
      iss: "urn:trace-api",
      sub: username,
      aud: "urn:trace-consumer",
      exp: timestamp + duration_mins * 60,
      iat: timestamp,
      token_use,
    };
  }

  public generateSecret(byte_count: number): Buffer {
    return crypto.randomBytes(byte_count);
  }

  public async mfaVerification(secret: string, code: string): Promise<boolean> {
    // TODO: Check MFA Codes.
    void secret;
    void code;
    return true;
  }
}

export default AuthService;
