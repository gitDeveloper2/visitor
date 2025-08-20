export type StripUndefined<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
  };