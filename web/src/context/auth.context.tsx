import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthData, AuthOption } from "../utils/types/authTypes";
import authStateReducer, { defaultAuthState } from "../hooks/authReducer";
import { refreshToken } from "../data/api";
import { getSessionAuthState, getSessionUser } from "../data/storage";

export const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [authState, authDispatch] = useReducer(
    authStateReducer,
    getSessionAuthState()
  );
  const navigate = useNavigate();
  const activeUser: AuthData | null = getSessionUser();

  const login = useCallback((data: AuthData) => {
    authDispatch({ type: AuthOption.LOGIN, payload: data });
    navigate("/");
  }, [navigate, authDispatch]);

  const logout = useCallback(() => {
    authDispatch({ type: AuthOption.LOGOUT });
    navigate("/");
  }, [navigate, authDispatch]);

  // Monitor token expiration
  useEffect(() => {
    const tokenMonitor = async () => {
      const now = Math.floor(Date.now() / 1000);
      if (activeUser === null) {
        // No active user. Signing out
        logout();
        return;
      }
      if (activeUser.refreshExpiry < now) {
        // Refresh expired. Signing out
        logout();
        return;
      }
      if (activeUser.expiry < now) {
        // Access expired. Refreshing
        const newAuthData: AuthData = await refreshToken(activeUser)
        return authDispatch({ type: AuthOption.LOGIN, payload: newAuthData });
      }
    };
    const interval = setInterval(tokenMonitor, 60*1000);
    return () => clearInterval(interval);
  }, [activeUser, logout]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
