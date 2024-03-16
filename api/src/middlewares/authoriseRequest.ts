import { Response, Request, NextFunction } from "express";
import { Scope, UserAttributes } from "../utils/types/attributeTypes";

export const authoriseRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
	// & unknown to indicate possible presence of other data. Does not affect typing, only documentative.
	const user: (UserAttributes & unknown) | undefined = res.locals.user;
	if (!user) {
		// Set within authenticateRequest middleware
		console.log("authoriseRequest middleware called before authenticateRequest middleware");
		res.status(500).end();
		return;
	}
	const userScopes: Scope[] = user.scopes;

	// TODO: Load dynamically, according to request pathname (req.path)
	// To not block presently, set to not require any scopes
	const requiredScopes: Scope[] = [];

	for (const required of requiredScopes) {
		if (!userScopes.includes(required)) {
			res.status(403).end();
			return;
		}
	}

	next();
};
