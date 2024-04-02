import { Scope } from "./attributeTypes";

export type GenericClaimStructure = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  token_use: TokenUse;
};

export type TokenUse = 'id' | 'access' | 'refresh';

export type RefreshToken = { token_use: 'refresh'; };
export type AccessToken = { token_use: 'access', scope: Scope[]; };
export type IdToken = {
  token_use: 'id';
  firstname: string;
  lastname: string;
  email: string;
};

export type UserLogin = {
  username: string;
  password: string;
};
