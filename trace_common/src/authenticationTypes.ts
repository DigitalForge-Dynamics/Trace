import { UUID } from "./index";
import { Scope } from "./attributeTypes";

export type GenericClaimStructure = {
  iss: string;
  sub: UUID;
  aud: string;
  exp: number;
  iat: number;
  token_use: TokenUse;
};

export const enum TokenUse {
  Id = 'id',
  Access = 'access',
  Refresh = 'refresh',
}

export type RefreshTokenPayload = { token_use: TokenUse.Refresh; username: string };
export type AccessTokenPayload = { token_use: TokenUse.Access, scope: Scope[]; };
export type IdTokenPayload = {
  token_use: TokenUse.Id;
  firstname: string;
  lastname: string;
  email: string;
};

export type TokenPayload = GenericClaimStructure & (RefreshTokenPayload | AccessTokenPayload | IdTokenPayload);

export type UserLogin = {
  username: string;
  password: string;
  mfaCode?: string;
};

export interface Tokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}
