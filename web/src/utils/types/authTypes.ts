export type { UUID, GenericClaimStructure, Tokens, IdTokenPayload, UserLogin } from "trace_common";

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
