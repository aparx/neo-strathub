export function createMultiMap<K, V>() {
  const map = new Map<K, V[]>();

  return {
    push: (key: K, value: V) => {
      const array = map.get(key) ?? [];
      map.set(key, [...array, value]);
    },
    get: (key: K) => map.get(key),
    keys: () => map.keys(),
    values: () => map.values(),
    size: () => map.size,
    forEach: (callbackFn: (key: K, value: V[] | undefined) => any) => {
      for (const key of map.keys()) callbackFn(key, map.get(key));
    },
  } as const;
}
