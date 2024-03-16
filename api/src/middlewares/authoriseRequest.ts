import { Response, Request, NextFunction, request } from "express";
import { RequiredKeyType, retrieveKeyPair } from "../utils/tokenService";
import jwt from "jsonwebtoken";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";

export const authoriseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		// Authentication should be being checked within authenticateRequest
		// Reaching this is indicative, of missing middleware
		console.log("authoriseRequest middleware called with no authorization header: Missing authenticateRequest middleware.");
		res.status(500).end();
		return;
	}
	const token = authHeader.split(" ")[1];
	const path: string = req.path;
	// & unknown to indicate possible presence of other data. Does not affect typing, only documentative.
	const user: (UserAttributes & unknown) | undefined = res.locals.user;
	if (!user) {
		// Set within authenticateRequest middleware
		console.log("authoriseRequest middleware called before authenticateRequest middleware");
		res.status(500).end();
		return;
	}
	const userScopes: Scope[] = user.scopes;

	// TODO: Load dynamically, according to request pathname
	const requiredScopes = [Scope.READ];

	for (const required of requiredScopes) {
		if (!userScopes.includes(required)) {
			res.status(403).end();
			return;
		}
	}

	next();
};
