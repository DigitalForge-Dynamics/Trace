export type UUID = `${string}-${string}-${string}-${string}-${string}`;

// Converts from `[K]?: T | undefined` to `[K]?: T`.
export type NonUndefinedOptional<T extends object> = {
  [K in keyof T]: Omit<T, K> extends T ?
    Exclude<T[K], undefined> : T[K];
};

export type HealthCheckType = {
  uptime: string;
  message: string;
  timestamp: Date;
};
