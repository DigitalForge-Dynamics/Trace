export type JsonNetworkType<T> =
  // Types with manual reviving
  T extends Date
    ? string
    : // Carry these through
    T extends number
    ? T
    : T extends boolean
    ? T
    : T extends string
    ? T
    : T extends JSON
    ? T
    : T extends object
    ? { [K in keyof T]?: JsonNetworkType<T[K]> }
    : T extends Array<infer E>
    ? Array<JsonNetworkType<E>>
    : // Unknown case
      T;


