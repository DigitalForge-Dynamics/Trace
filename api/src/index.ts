import express, { Express, Request, Response } from "express";
import "dotenv/config";
import { migrator } from "./database/config/databaseClient";
import { redisClient } from "./database/config/redisClient";
import { exchangeOidcCode, initiateOidc, lookupProvider } from "./oidc";

const app: Express = express();
const port = process.env.API_PORT;
export const API_URL = process.env.API_URL;

const startupConfiguration = async () => {
  await migrator.up();
  await redisClient.connect();
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startupConfiguration();
});

app.get("/oidc/init/:provider", async (req: Request, res: Response) => {
  const { provider: providerName } = req.params;
  try {
    const provider = lookupProvider(providerName);
    if (!provider) throw new Error("Invalid provider"); // TODO: NotFoundError
    await initiateOidc(provider);
  } catch (err) {
    if (!(err instanceof Error)) {
      console.log(`Unexpected thrown value: ${err}:${JSON.stringify(err)}`);
      res.status(500).send("Unexpected error occurred");
      return;
    }
    const { code, message } = getErrorResponse(err);
    res.status(code).send(message);
  }
});

app.get("/oidc/code/:provider", async (req: Request, res: Response) => {
  // TODO: Match csrf in returned query with generated one in initiateOidc
  // Query:
  //	state=${state} // Check csrf matches
  //	code=${code} // One time use to be exchanged for access and id tokens
  //	scope=${scope} // Permitted scopes, %20 separated
  // TODO: Exchange code for tokens

  const { provider: providerName } = req.params;
  const { state, code, scope } = req.query;
  try {
    const provider = lookupProvider(providerName);
    if (!provider) throw new Error("Invalid provider"); // TODO: NotFoundError
    if (typeof code !== "string") throw new Error("Invalid code"); // TODO: BadRequestError
    const tokens = await exchangeOidcCode(provider, code);
    // TODO:
    //	Validate access list / email is from permitted domain if desired - Based off id token
    // 	Return access token to user, storing access token and refresh token // TODO Question: This endpoint is called by IDP, so does not have user connection
    //	When user signs in, they provide access_token, and as long as it's valid and not expired, we allow
    //		If expired, use refresh token to get new access token from IDP and return to user
  } catch (err) {
    if (!(err instanceof Error)) {
      console.log(`Unexpected thrown value: ${err}:${JSON.stringify(err)}`);
      res.status(500).send("Unexpected error occurred");
      return;
    }
    const { code, message } = getErrorResponse(err);
    res.status(code).send(message);
  }
});

app.get("/oidc/refresh", () => {}); // TODO: Possibly to be used to allow a user to update their access token, using their refresh token

export const checkNever = (_: never) => {}; // Used for TS checking exhaustiveness of checks

const getErrorResponse = (err: Error): { code: number; message: string } => {
  console.log(err);
  return { code: 500, message: "Internal server error" };
};
