import React from "react";
import { AuthAction, AuthState } from "../utils/types/authTypes";

export const defaultAuthState: AuthState = {
  isLoggedIn: false,
};

const authStateReducer: React.Reducer<AuthState, AuthAction> = (
  state,
  action
) => {
  if (action.type === "LOGIN") {
    sessionStorage.setItem("trace_user", JSON.stringify(action.payload));
    return {
      ...state,
      isLoggedIn: true,
      authToken: action.payload.accessToken,
      userId: action.payload.userId,
      email: action.payload.email,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
    };
  }
  if (action.type === "LOGOUT") {
    sessionStorage.removeItem("trace_user");
    return defaultAuthState;
  }

  return defaultAuthState;
};

export default authStateReducer;
