import React, {
  createContext,
  useReducer,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthData, AuthOption } from "../utils/types/authTypes";
import authStateReducer, { defaultAuthState } from "../hooks/authReducer";

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

  const login = useCallback((data: AuthData) => {
    authDispatch({ type: AuthOption.LOGIN, payload: data });
    navigate("/");
  }, [navigate, authDispatch]);

  const logout = useCallback(() => {
    authDispatch({ type: AuthOption.LOGOUT });
  }, [authDispatch]);

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
