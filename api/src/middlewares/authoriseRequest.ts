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

	const requiredScopes: Scope[] | null = getRequiredScopes(req.path);
	console.debug("Got requiredScopes", requiredScopes);

	if (requiredScopes === null) {
		console.log("Path does not have any required scopes defined. If no scopes are required, explicitly require an empty array.");
		res.status(403).end();
		return;
	}

	for (const required of requiredScopes) {
		if (!userScopes.includes(required)) {
			res.status(403).end();
			return;
		}
	}

	next();
	console.debug("Reached end");
};

// TODO: Load dynamically, according to request pathname
// To not block presently, set to not require any scopes
export const getRequiredScopes = (requestPath: string): Scope[] | null => {
	console.debug("Not mocking out getRequiredScopes");
	return [];
};
