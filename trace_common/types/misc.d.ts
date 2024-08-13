export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type NonUndefinedOptional<T extends object> = {
    [K in keyof T]: Omit<T, K> extends T ? Exclude<T[K], undefined> : T[K];
};
