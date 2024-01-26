import crypto from "crypto";
import fs from "fs";
import jose, { SignJWT } from "jose";

const publicKeyPath = __dirname + "/trace_rsa_public_key.pem";
const privateKeyPath = __dirname + "/trace_rsa_private_key.pem";

const generateJwtJeyPair = () => {
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  fs.writeFileSync(publicKeyPath, keyPair.publicKey);
  fs.writeFileSync(privateKeyPath, keyPair.privateKey);
};

export const generateJwt = async (tokenId: number) => {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    generateJwtJeyPair();
  }

  const publicKey = fs.readFileSync(publicKeyPath);

  const token = await new SignJWT({ id: tokenId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("trace-api")
    .setAudience("trace-consumer")
    .setExpirationTime("2hrs")
    .sign(publicKey);

  return token;
};
