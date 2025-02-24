import {
  Tokens,
  AuthData,
  IdTokenPayload,
  AccessTokenPayload,
  RefreshTokenPayload,
  GenericClaimStructure,
  UserLogin,
} from "../utils/types/authTypes";

import {
  validateTokens,
  validateIdToken,
  validateAccessToken,
  validateRefreshToken,
} from "../utils/validators/authValidators";

const API_URL = "http://localhost:3000";
export type UserLoginData = Required<UserLogin>;

export const fetcher = async <T>(url: string, auth: AuthData): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
}

export const loginUser = async (userData: UserLoginData): Promise<Tokens> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
      ...(userData.mfaCode ? { mfaCode: userData.mfaCode } : {}),
    }),
  });
  if (res.status !== 200) {
    throw new Error();
  }
  const data: unknown = await res.json();
  const tokens: Tokens = validateTokens(data);
  return tokens;
};

export const decodeUserAuth = (tokens: Tokens): AuthData => {
  const idTokenPayload: IdTokenPayload & GenericClaimStructure =
    validateIdToken(decodeTokenPayload(tokens.idToken));
  const accessTokenPayload: AccessTokenPayload & GenericClaimStructure =
    validateAccessToken(decodeTokenPayload(tokens.accessToken));
  const refreshTokenPayload: RefreshTokenPayload & GenericClaimStructure =
    validateRefreshToken(decodeTokenPayload(tokens.refreshToken));
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiry: accessTokenPayload.exp,
    refreshExpiry: refreshTokenPayload.exp,
    email: idTokenPayload.email,
    firstName: idTokenPayload.firstname,
    lastName: idTokenPayload.lastname,
  };
};

const decodeTokenPayload = (token: string): unknown | null => {
  try {
    const body = token.split(".")[1];
    if (body === undefined) return null;
    return JSON.parse(atob(body));
  } catch (err) {
    return null;
  }
};

export const refreshToken = async (authData: AuthData): Promise<AuthData> => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.refreshToken}`,
    },
  });
  if (res.status !== 200) {
    throw new Error();
  }
  const accessToken: string = await res.text();
  const accessTokenPayload: AccessTokenPayload & GenericClaimStructure =
    validateAccessToken(decodeTokenPayload(accessToken));
  return {
    ...authData,
    accessToken,
    expiry: accessTokenPayload.exp,
  };
};

export const initMfa = async (authData: AuthData): Promise<string | null> => {
  const res = await fetch(`${API_URL}/auth/totp/init`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authData.accessToken}`,
    },
  });
  if (res.status !== 200) {
    return null;
  }
  const secret: string = await res.text();
  return secret;
};

export const enableMfa = async (
  authData: AuthData,
  mfaCode: string
): Promise<boolean> => {
  const res = await fetch(`${API_URL}/auth/totp/enable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authData.accessToken}`,
    },
    body: JSON.stringify({
      code: mfaCode,
    }),
  });
  if (res.status !== 204) {
    return false;
  }
  return true;
};
