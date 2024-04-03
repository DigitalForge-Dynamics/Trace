import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthData, AuthOption } from "../utils/types/authTypes";
import authStateReducer, { defaultAuthState } from "../hooks/authReducer";
import { getSessionUser } from "../data/api";

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
  const navigate = useNavigate();

  useEffect(() => {
    const userData: AuthData | null = getSessionUser();
    if (userData && !authState.isLoggedIn) {
      authDispatch({ type: AuthOption.LOGIN, payload: userData });
    } else if (!userData && authState.isLoggedIn) {
      authDispatch({ type: AuthOption.LOGOUT });
    }
  }, [authState.isLoggedIn]);

  const login = useCallback(
    (data: AuthData) => {
      authDispatch({
        type: AuthOption.LOGIN,
        payload: data,
      });
      navigate("/");
    },
    [navigate]
  );

  const logout = useCallback(() => {
    authDispatch({ type: AuthOption.LOGOUT });
    navigate("/login");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
