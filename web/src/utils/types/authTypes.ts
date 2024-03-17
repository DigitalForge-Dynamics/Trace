export enum AuthOption {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export type AuthState =
	| { isLoggedIn: false }
	| {
		isLoggedIn: true;
		authToken: string;
		userId: string;
		email: string;
		firstName: string;
		lastName: string;
	};


export interface AuthContextProps {
  authState: AuthState;
  login: (data: AuthData) => void;
  logout: () => void;
}

export type AuthAction =
  | {
      type: AuthOption.LOGIN;
      payload: AuthData;
    }
  | {
      type: AuthOption.LOGOUT;
      payload: null;
    };

export type AuthData = {
  accessToken: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};
