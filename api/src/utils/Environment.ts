export const isDevelopment = (): boolean => process.env.NODE_ENV === "development";
export const isSeedDatabase = (): boolean => process.env.API_SEED_DATABASE === "true";

export const getDatabaseName = (): string | undefined => process.env.API_DATABASE_NAME;
export const getDatabaseUsername = (): string | undefined => process.env.API_DATABASE_USERNAME;
export const getDatabasePassword = (): string | undefined => process.env.API_DATABASE_PASSWORD;
export const getDatabaseHost = (): string | undefined => process.env.API_DATABASE_HOST;

export const getCachePassword = (): string | undefined => process.env.API_REDIS_PASSWORD;
export const getCacheHost = (): string | undefined => process.env.API_REDIS_HOST;

export const getApiPort = (): number | undefined => {
  const value = process.env.API_PORT;
  if (value === undefined) return undefined;
  return parseInt(value);
};

export const getSigningKey = (): string | undefined => process.env.EXPRESS_SECRET_KEY;
export const setSigningKey = (key: string) => {
  process.env.EXPRESS_SECRET_KEY = key;
};
