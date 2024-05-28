import {
  Tokens,
  AuthData,
  IdTokenPayload,
  GenericClaimStructure,
} from "../utils/types/authTypes";

const API_URL = "http://localhost:3000";

export interface UserLoginData {
  username: string;
  password: string;
  mfaCode: string;
}

export const fetcher = (url: string, auth: AuthData): Promise<any> =>
  fetch(`${API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${auth.accessToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

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

  const data: Tokens = await res.json();
  return data;
};

export const decodeUserAuth = (tokens: Tokens): AuthData => {
  const idTokenPayload = decodeTokenPayload(
    tokens.idToken
  ) as IdTokenPayload | null;
  const accessTokenPayload = decodeTokenPayload(
    tokens.accessToken
  ) as GenericClaimStructure | null;
  const refreshTokenPayload = decodeTokenPayload(
    tokens.refreshToken
  ) as GenericClaimStructure | null;
  if (
    idTokenPayload === null ||
    accessTokenPayload === null ||
    refreshTokenPayload === null
  ) {
    throw new Error();
  }
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
  const accessTokenPayload = decodeTokenPayload(
    accessToken
  ) as GenericClaimStructure | null;
  if (accessTokenPayload === null) throw new Error();
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
