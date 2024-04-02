import type { Scope, UserAttributes } from "../attributeTypes.ts";
import type { GenericClaimStructure } from "../authenticationTypes.ts";
import { TokenUse } from "./authenticationTypes.js";

declare global {
  namespace Express {
    interface Locals {
      user?: UserAttributes & GenericClaimStructure;
      required_scopes?: Scope[];
      token_type?: TokenUse;
    }
  }
}
