import * as argon2 from "argon2";
import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";

const publicKeyPath = __dirname + "/trace_rsa_public_key.pem";
const privateKeyPath = __dirname + "/trace_rsa_private_key.pem";

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
    },
  });

  fs.writeFileSync(publicKeyPath, publicKey);
  fs.writeFileSync(privateKeyPath, privateKey);
};

export const retrieveKeyPair = (requiredKey: RequiredKeyType) => {
	if (requiredKey === RequiredKeyType.privateKey) {
		return fs.readFileSync(privateKeyPath);
	} else {
		return fs.readFileSync(publicKeyPath);
	}
};

export const generateSignedJwt = (
  userId: number,
  userScopes: string[]
) => {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    generateKeyPair();
  }

  const signingKey = fs.readFileSync(privateKeyPath);

  const token = jwt.sign(
    {
      id: userId,
      scopes: userScopes,
      iss: "urn:trace-api",
      aud: "urn:trace-consumer",
      iat: Date.now(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      jti: crypto.randomUUID(),
    },
    signingKey,
    {
      algorithm: "RS512",
    }
  );

  return token;
};

export const hashPassword = async (password: string) => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

export const verifyPassword = async (
  hashedPassword: string,
  loginRequestPassword: string
) => {
  const validPassword = await argon2.verify(
    hashedPassword,
    loginRequestPassword
  );
  return validPassword;
};

export enum RequiredKeyType {
  publicKey = "public",
  privateKey = "private",
}
