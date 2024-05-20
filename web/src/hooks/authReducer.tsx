import React from "react";
import { AuthAction, AuthState, AuthOption } from "../utils/types/authTypes";
import { setSessionUser, removeSessionUser } from "../data/storage";

const authStateReducer: React.Reducer<AuthState, AuthAction> = (
  state: AuthState,
  action: AuthAction,
) => {
  switch(action.type) {
    case AuthOption.LOGIN: {
      setSessionUser(action.payload);
      return {
        ...state,
        data: action.payload,
        isLoggedIn: true,
      };
    }
    case AuthOption.LOGOUT: {
      removeSessionUser();
      return { isLoggedIn: false };
    }
  }
};

export default authStateReducer;
