// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type First<T extends any[]> = T extends [] ? undefined : T[0];
