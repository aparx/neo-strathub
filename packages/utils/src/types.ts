/**
 * Self-recursive record contract, deeply ensuring a certain value type.
 * In other words, this is a deep record that is self-recursive, of which any property
 * has a value equal to a union of `TValue` and the contract itself (being
 * `DeepContract<TValue>`).
 */
export type DeepRecord<TValue = any> = {
  [key: PropertyKey]: TValue | DeepRecord<TValue>;
};
