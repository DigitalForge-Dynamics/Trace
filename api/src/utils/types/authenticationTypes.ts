export type GenericClaimStructure = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
};

export type UserLogin = {
  username: string;
  password: string;
};
