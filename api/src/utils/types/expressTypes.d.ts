import type { Scope, UserAttributes } from "../attributeTypes.ts";
import type { GenericClaimStructure } from "../authenticationTypes.ts";

declare global {
  namespace Express {
    interface Locals {
      user?: UserAttributes & GenericClaimStructure;
      required_scopes?: Scope[];
    }
  }
}
