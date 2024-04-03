import { Tokens, AuthData, IdTokenPayload } from "../utils/types/authTypes";

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

  const data: Tokens = await res.json();
  return data;
};

export const decodeUserAuth = (tokens: Tokens): AuthData => {
  const idTokenBody = tokens.idToken.split(".")[1];
  if (idTokenBody === undefined) throw new Error();
  const idTokenPayload = JSON.parse(atob(idTokenBody)) as IdTokenPayload;
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    email: idTokenPayload.email,
    firstName: idTokenPayload.firstname,
    lastName: idTokenPayload.lastname,
  };
};

export const setSessionUser = (user: AuthData): void => {
  sessionStorage.setItem("trace_user", JSON.stringify(user));
};

export const getSessionUser = (): AuthData | null => {
  const item = sessionStorage.getItem("trace_user");
  if (item === null) return null;
  return JSON.parse(item) as AuthData;
};

export const removeSessionUser = (): void => {
  sessionStorage.removeItem("trace_user");
};
