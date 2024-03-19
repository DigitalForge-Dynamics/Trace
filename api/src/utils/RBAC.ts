import { Scope } from "./types/attributeTypes";

// TODO: Load dynamically, according to request pathname
// To not block presently, set to not require any scopes
export const getRequiredScopes = (requestPath: string): Scope[] | null => {
  console.log(`getRequiredScopes called with:${requestPath}`);
  return [];
};
