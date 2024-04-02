import { Scope } from "./attributeTypes";

export type GenericClaimStructure = {
  iss: string;
  sub: string;
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

export type RefreshToken = { token_use: TokenUse.Refresh; };
export type AccessToken = { token_use: TokenUse.Access, scope: Scope[]; };
export type IdToken = {
  token_use: TokenUse.Id;
  firstname: string;
  lastname: string;
  email: string;
};

export type UserLogin = {
  username: string;
  password: string;
};
