import type { Scope, UserAttributes } from "../attributeTypes.ts";
import type { GenericClaimStructure } from "../authenticationTypes.ts";
import { TokenPayload, TokenUse } from "./authenticationTypes.js";

declare global {
  namespace Express {
    interface Locals {
      user?: TokenPayload;
      required_scopes?: Scope[];
    }
  }
}
