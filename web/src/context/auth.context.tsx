import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { AuthContextProps, AuthData, AuthOption } from "../utils/types/authTypes";
import authStateReducer, { defaultAuthState } from "../hooks/authReducer";
import { getSessionUser } from "../data/storage";

export const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, authDispatch] = useReducer(
    authStateReducer,
    defaultAuthState
  );

  useEffect(() => {
    const userData: AuthData | null = getSessionUser();
    if (userData && !authState.isLoggedIn) {
      authDispatch({ type: AuthOption.LOGIN, payload: userData });
    } else if (!userData && authState.isLoggedIn) {
      authDispatch({ type: AuthOption.LOGOUT });
    }
  }, [authState.isLoggedIn]);

  const login = useCallback((data: AuthData) => {
    authDispatch({ type: AuthOption.LOGIN, payload: data });
  }, []);

  const logout = useCallback(() => {
    authDispatch({ type: AuthOption.LOGOUT });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
