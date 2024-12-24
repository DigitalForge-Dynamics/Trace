import { AuthData, AuthState } from "../utils/types/authTypes";
import { validateAuthData } from "../utils/validators/authValidators";

export const setSessionUser = (user: AuthData): void => {
  sessionStorage.setItem("trace_user", JSON.stringify(user));
};

export const getSessionUser = (): AuthData | null => {
  const item = sessionStorage.getItem("trace_user");
  if (item === null) return null;
  const authData: AuthData = validateAuthData(JSON.parse(item));
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

export const getSessionOidcState = (): string | null => {
	return sessionStorage.getItem("oidc_state");
}

export const setSessionOidcState = (state: string) => {
	sessionStorage.setItem("oidc_state", state);
};

export const removeSessionOidcState = () => {
	sessionStorage.removeItem("oidc_state");
};
