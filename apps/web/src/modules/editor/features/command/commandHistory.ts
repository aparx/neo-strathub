import { Nullish } from "@repo/utils";

export class CommandHistory<T> {
  private readonly _stack: Array<T | Nullish>;
  private _index: number = -1;
  private _cursor: number = -1;

  constructor(public readonly size: number) {
    this._stack = new Array(size);
  }

  push(...commands: T[]) {
    commands.forEach((command) => {
      if (this._index >= this._stack.length - 1)
        this.lshift(this._stack.length - this._index);
      this._index = Math.min(1 + this._index, this._stack.length - 1);
      this._stack[this._index] = command;
      this._cursor = this._index;
    });
  }

  toArray(): T[] {
    if (this._index < 0) return [];
    return this._stack.slice(0, 1 + this._index) as T[];
  }

  length() {
    return 1 + this._index;
  }

  cursor() {
    return this._cursor;
  }

  index() {
    return this._index;
  }

  /** Moves the cursor backwards (used for `undo`) */
  moveBack(): T | Nullish {
    if (this._cursor >= 0 && this._index >= 0) {
      return this._stack[this._cursor--];
    }
    return null;
  }

  /** Moves the cursor forwards (used for `redo`) */
  moveForward(): T | Nullish {
    if (this._cursor < this._index) {
      return this._stack[++this._cursor];
    }
    return null;
  }

  /** Performs a left shift by `n` on this stack */
  private lshift(n: number) {
    if (n < 0) throw new Error("Cannot shift right");
    for (let i = n; i < this._stack.length; ++i) {
      this._stack[i - n] = this._stack[i];
    }
    if (this._stack.length < 2 * n)
      for (let i = 0; i < n; ++i) {
        this._stack[i] = null;
      }
  }
}
