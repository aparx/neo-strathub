type ArrayFactory<K, V> = (key: K) => V[];

export class MultiMap<K, V> extends Map<K, V[]> {
  public static DEFAULT_ALLOCATOR: ArrayFactory<any, any> = () => [];

  private _map = new Map<K, V[]>();
  private _factory: (key: K) => V[] = MultiMap.DEFAULT_ALLOCATOR;

  constructor();
  constructor(initialSize: number);
  constructor(factory: ArrayFactory<K, V>);
  constructor(arg?: number | ArrayFactory<K, V>) {
    super();
    if (typeof arg === "function") {
      this._factory = arg;
    } else if (typeof arg === "number") {
      this._factory = () => new Array(arg);
    }
  }

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
    const array = this._map.get(key) ?? this.createArray(key);
    this._map.set(key, [...array, value]);
    return this;
  }

  retain(key: K, filterPredicate: (val: V) => boolean) {
    const array = this._map.get(key) ?? this.createArray(key);
    this._map.set(key, array.filter(filterPredicate));
    return this;
  }

  remove(key: K, removePredicate: (val: V) => boolean) {
    return this.retain(key, (val) => !removePredicate(val));
  }

  createArray(key: K) {
    const newArray = this._factory(key);
    // Additional assertion at compile time, even if not needed
    if (newArray == null) throw new Error("Array cannot be null");
    return newArray;
  }
}
