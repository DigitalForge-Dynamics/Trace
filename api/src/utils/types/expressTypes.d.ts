import type { Scope } from "../attributeTypes.ts";

declare global {
  namespace Express {
    interface Locals {
      required_scopes?: Scope[]
    }
  }
}
