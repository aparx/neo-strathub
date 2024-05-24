/**
 * Self-recursive record contract, deeply ensuring a certain value type.
 * In other words, this is a deep record that is self-recursive, of which any property
 * has a value equal to a union of `TValue` and the contract itself (being
 * `DeepContract<TValue>`).
 */
export type DeepRecord<TValue = any> = {
  [key: PropertyKey]: TValue | DeepRecord<TValue>;
};

/** Deeply ensures all properties of `T` to be partial. */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/** Deeply ensures all properties of `T` to be readonly. */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

export type Numberish = number | `${number}`;

export type Nullish<T = never> = T | null | undefined;

export type InferAsync<T> = T extends Promise<infer TInner> ? TInner : never;

export type ExtractIterable<T> = T extends Iterable<any> ? never : T;
