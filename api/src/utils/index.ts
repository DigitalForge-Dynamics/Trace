export const isDevelopment = (): boolean => process.env.NODE_ENV === "development";
export const isSeedDatabase = (): boolean => process.env.API_SEED_DATABASE === "true";
