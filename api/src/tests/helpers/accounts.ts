const { API_PORT } = process.env;
const API_URL = `http://localhost:${API_PORT}`;

export interface Tokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

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
  const data: Tokens = await res.json();
  return data;
}
