import React from "react";
import { AuthAction, AuthState, AuthOption } from "../utils/types/authTypes";
import { setSessionUser, removeSessionUser } from "../data/storage";

export const defaultAuthState: AuthState = {
  isLoggedIn: false,
};

const authStateReducer: React.Reducer<AuthState, AuthAction> = (
  state: AuthState,
  action: AuthAction,
) => {
  if (action.type === AuthOption.LOGIN) {
    setSessionUser(action.payload);
    return {
      ...state,
      data: action.payload,
      isLoggedIn: true,
    };
  }
  if (action.type === AuthOption.LOGOUT) {
    removeSessionUser();
    return defaultAuthState;
  }

  return defaultAuthState;
};

export default authStateReducer;
