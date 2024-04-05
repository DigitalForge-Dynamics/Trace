import { Tokens, AuthData, IdTokenPayload, GenericClaimStructure } from "../utils/types/authTypes";

export interface UserLoginData {
  username: string;
  password: string;
}

export const loginUser = async (userData: UserLoginData): Promise<Tokens> => {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
    }),
  });
  if (res.status !== 200) {
    throw new Error();
  }

  const data: Tokens = await res.json();
  return data;
};

export const decodeUserAuth = (tokens: Tokens): AuthData => {
  const idTokenPayload = decodeTokenPayload(tokens.idToken) as IdTokenPayload | null;
  const accessTokenPayload = decodeTokenPayload(tokens.accessToken) as GenericClaimStructure | null;
  const refreshTokenPayload = decodeTokenPayload(tokens.refreshToken) as GenericClaimStructure | null;
  if (idTokenPayload === null || accessTokenPayload === null || refreshTokenPayload === null) {
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
  const res = await fetch("http://localhost:3000/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authData.refreshToken}`,
    },
  });
  if (res.status !== 200) {
    throw new Error();
  }
  const accessToken: string = await res.text();
  const accessTokenPayload = decodeTokenPayload(accessToken) as GenericClaimStructure | null;
  if (accessTokenPayload === null) throw new Error();
  return {
    ...authData,
    accessToken,
    expiry: accessTokenPayload.exp,
  };
};
