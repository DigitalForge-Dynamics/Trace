import React, {
  createContext,
  useReducer,
  useEffect,
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

  useEffect(() => {
    const user = sessionStorage.getItem("trace_user");

    if (user) {
      const userData: AuthData = JSON.parse(user);
      authDispatch({ type: AuthOption.LOGIN, payload: userData });
    }
  }, []);

  const login = useCallback(
    (data: AuthData) => {
      const { accessToken, email, firstName, lastName } = data;
      authDispatch({
        type: AuthOption.LOGIN,
        payload: {
          accessToken,
          email,
          firstName,
          lastName,
        },
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
