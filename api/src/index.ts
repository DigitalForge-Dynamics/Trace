import express, { Express, Request } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT;

export const checkNever = (t: never) => {}; // Used for TS checking exhaustiveness of checks

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
});

app.get('/oidc/init', () => {
	// TODO:
	// Get requested provider name
	// Check in list of enabled providers
	// Get provider details
	// Initiate OIDC flow for provider

});

app.get('/oidc/code', (req: Request) => {
	// TODO: Match csrf in returned query with generated one in initiateOidc
	// Query:
	//	state=${state} // Check csrf matches
	//	code=${code} // One time use to be exchanged for access and id tokens
	//	scope=${scope} // Permitted scopes, %20 separated
	// TODO: Exchange code for tokens
});
