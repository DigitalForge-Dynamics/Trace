export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type Scope = string;

export enum AuthOption {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export type AuthState =
| { isLoggedIn: false }
| { isLoggedIn: true; data: AuthData; };

export interface AuthContextProps {
  authState: AuthState;
  login: (data: AuthData) => void;
  logout: () => void;
}

export type AuthAction =
| { type: AuthOption.LOGOUT; }
| { type: AuthOption.LOGIN; payload: AuthData; };

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  expiry: number;
  refreshExpiry: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type Tokens = {
  accessToken: string;
  idToken: string;
  refreshToken: string;
};

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

export type IdTokenPayload = {
  token_use: TokenUse.Id;
  firstname: string;
  lastname: string;
  email: string;
};

