export class MultiMap<K, V> extends Map<K, V[]> {
  private _map = new Map<K, V[]>();

  clear() {
    this._map.clear();
  }

  delete(key: K) {
    return this._map.delete(key);
  }

  forEach(
    callbackfn: (value: V[], key: K, map: Map<K, V[]>) => void,
    thisArg?: any,
  ): void {
    return this._map.forEach(callbackfn, thisArg);
  }

  get(key: K) {
    return this._map.get(key);
  }

  has(key: K) {
    return this._map.has(key);
  }

  set(key: K, value: V[]) {
    this._map.set(key, value);
    return this;
  }

  push(key: K, value: V) {
    const array = this._map.get(key) ?? [];
    this._map.set(key, [...array, value]);
  }

  retain(key: K, filterPredicate: (val: V) => boolean) {
    const array = this._map.get(key) ?? [];
    this._map.set(key, array.filter(filterPredicate));
  }
}
