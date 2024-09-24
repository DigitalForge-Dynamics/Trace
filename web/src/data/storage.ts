import { AuthData, AuthState } from "../utils/types/authTypes";
import { validateAuthData } from "../utils/validators/authValidators";

export const setSessionUser = (user: AuthData): void => {
  sessionStorage.setItem("trace_user", JSON.stringify(user));
};

export const getSessionUser = (): AuthData | null => {
  const item = sessionStorage.getItem("trace_user");
  if (item === null) return null;
  const authData: AuthData = validateAuthData(item);
  return authData;
};

export const removeSessionUser = (): void => {
  sessionStorage.removeItem("trace_user");
};

export const getSessionAuthState = (): AuthState => {
  const data = getSessionUser();
  if (data === null) return { isLoggedIn: false };
  return { isLoggedIn: true, data };
};
