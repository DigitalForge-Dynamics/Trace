import * as argon2 from "argon2";
import crypto from "crypto";
import fs from "fs";
import { SignJWT } from "jose";

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

export const generateSignedJwt = async (userId: number, userScopes: string[]) => {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    generateKeyPair();
  }

  const signingKey = fs.readFileSync(privateKeyPath);

  const token = await new SignJWT({ id: userId, scopes: userScopes })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("urn:trace-api")
    .setAudience("urn:trace-consumer")
    .setExpirationTime("2hrs")
    .setJti(crypto.randomUUID())
    .sign(signingKey);

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
