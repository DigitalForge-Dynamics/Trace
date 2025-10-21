import { Scope, UserStoredAttributes } from "../utils/types/attributeTypes";
import * as argon2 from "argon2";
import crypto, { UUID } from "crypto";
import { GenericClaimStructure, TokenUse } from "../utils/types/authenticationTypes";
import { decodeBase32 } from "../utils/Encodings";
import { getSigningKey, setSigningKey } from "../utils/Environment";
import { SignJWT } from "jose";

class AuthService {
  public async generateIdToken(user: UserStoredAttributes): Promise<string> {
    const tokenClaims = this.generateClaims(TokenUse.Id, user.username);
	const signKey = new Uint8Array(new Buffer(this.getJWTSecretKey(), "base64"));
    return new SignJWT({
        ...tokenClaims,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
	})
	.setProtectedHeader({ alg: "HS512" })
	.sign(signKey);
  }

  public async generateAccessToken(scopes: Scope[], username: string): Promise<string> {
    const tokenClaims = this.generateClaims(TokenUse.Access, username);
	const signKey = new Uint8Array(new Buffer(this.getJWTSecretKey(), "base64"));
  	return new SignJWT({
		...tokenClaims,
		scope: scopes,
	})
	.setProtectedHeader({ alg: "HS512" })
	.sign(signKey);
  }

  public async generateRefreshToken(username: string): Promise<string> {
    const tokenClaims = this.generateClaims(TokenUse.Refresh, username);
	const signKey = new Uint8Array(new Buffer(this.getJWTSecretKey(), "base64"));
	return new SignJWT({
		...tokenClaims,
		username,
	})
	.setProtectedHeader({ alg: "HS512" })
	.sign(signKey);
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
    let signingKey = getSigningKey();

    if (!signingKey) {
      signingKey = this.generateSecret(256).toString("base64");
      setSigningKey(signingKey);
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
      sub: this.generateUuid(username),
      aud: "urn:trace-consumer",
      exp: timestamp + duration_mins * 60,
      iat: timestamp,
      token_use,
    };
  }

  public generateSecret(byte_count: number): Buffer {
    return crypto.randomBytes(byte_count);
  }

  public mfaVerification(secret: string, code: string): boolean {
    const secretBytes: Buffer = decodeBase32(secret);
    const index = Math.floor(Date.now() / 1000 / 30);
    const generatedCode: string = this.generateMfaCode(new Uint8Array(secretBytes), index);
    return generatedCode === code;
  }

  public generateMfaCode(secret: Uint8Array, index: number): string {
    const buffer: Buffer = Buffer.alloc(8);
    buffer.writeUInt32BE(index, 4);
    const digest: Buffer = crypto
      .createHmac("sha1", secret)
      .update(new Uint8Array(buffer))
      .digest();
    const offset: number = digest.readUInt8(digest.length - 1) & 0xF;
    const resultNumber: number =
      ((digest.readUInt8(offset) & 0x7F) << 24
      | (digest.readUInt8(offset+1) << 16)
      | (digest.readUInt8(offset+2) << 8)
      | (digest.readUInt8(offset+3) << 0))
      % 1000000;
    return resultNumber.toString().padStart(6, '0');
  }

  public generateUuid(seed: string): UUID {
    const hash = crypto
    .createHash("sha256")
    .update(seed)
    .digest("hex");
    const uuidParts = [
        hash.substring(0, 8),
        hash.substring(8, 12),
        '4'+hash.substring(12, 15), // Version 4
        '8'+hash.substring(15, 18), // Variant 8 (RFC 4122)
        hash.substring(18, 30),
    ];
    return `${uuidParts[0]}-${uuidParts[1]}-${uuidParts[2]}-${uuidParts[3]}-${uuidParts[4]}`;
  }
}

export default AuthService;
