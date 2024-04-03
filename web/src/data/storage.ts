import { AuthData  } from "../utils/types/authTypes";

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
