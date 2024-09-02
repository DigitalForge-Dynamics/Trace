import type { Tokens } from "../../utils/types/authenticationTypes";

const { API_PORT } = process.env;
const API_URL = `http://localhost:${API_PORT}`;

export const signIn = async (username: string, password: string): Promise<Tokens> => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  };
  const res = await fetch(`${API_URL}/auth/login`, options);
  const data: Tokens = await res.json() as Tokens;
  return data;
}
