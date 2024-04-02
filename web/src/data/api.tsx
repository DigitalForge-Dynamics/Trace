import { Tokens, AuthData, IdTokenPayload } from "../utils/types/authTypes";

export interface UserLoginData {
  username: string;
  password: string;
}

export const fetchUserTokens = async (userData: UserLoginData): Promise<Tokens> => {
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
    accessToken: tokens.accesstoken,
    userId: 'TODO',
    email: idTokenPayload.email,
    firstName: idTokenPayload.firstname,
    lastName: idTokenPayload.lastname,
  };
};
