import {
  DEFAULT_KEY_TREE,
  DefaultEditorKeyTree,
  EditorKeyTreeContract,
  KeyMappingValue,
} from "./editorKeyTree";

export type PartialKeyEvent = Partial<
  Pick<
    React.KeyboardEvent,
    "altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "code"
  >
>;

export type InferKeyMapKeys<T> =
  T extends EditorKeyMap<infer TTree>
    ? keyof TTree
    : T extends DefaultEditorKeyTree
      ? keyof T
      : "Cannot infer keyboard keys";

export class EditorKeyMap<
  TTree extends EditorKeyTreeContract = DefaultEditorKeyTree,
> {
  public static DEFAULT_MAP = new EditorKeyMap<DefaultEditorKeyTree>(
    DEFAULT_KEY_TREE,
  );

  private readonly _keys: Array<keyof TTree>;
  private readonly _tree: TTree;

  constructor(tree: TTree) {
    this._tree = structuredClone(tree); // Ensure immutability at runtime
    // Get keys on initial construction, to avoid more than one O(n)
    this._keys = Object.keys(this._tree) as typeof this._keys;
  }

  get tree(): TTree {
    return this._tree;
  }

  /** Returns true if `event` is matching the mapping for `key` in this tree */
  isMatching(key: keyof TTree, event: PartialKeyEvent): boolean {
    const mapping = this.tree[key];
    if (!mapping) throw new Error("Impossible: Key mapping does not exist");
    return isKeyPressed(mapping, event);
  }

  /** Finds the first key mapping matching given `event` */
  findMatching(event: PartialKeyEvent): keyof TTree | undefined {
    // TODO future implementations might want to focus on specificity, such
    // TODO that the last key with most aspects of `event` matching is returned.
    // TODO That is, `event` is fully fulfilling the key's obligatory fields.
    return this._keys.find((key) => this.isMatching(key, event));
  }

  /** Calls `callback` for each key mapping `event` is matching */
  forEachMatching(
    event: PartialKeyEvent,
    callback: (this: EditorKeyMap<TTree>, key: keyof TTree) => void,
  ): void {
    this._keys.forEach((key) => {
      if (!this.isMatching(key, event)) return;
      callback.call(this, key);
    });
  }

  /** Collects and returns all key mappings `event` is matching */
  collectMatches(event: PartialKeyEvent): Array<keyof TTree> {
    const keysPressed = new Array<keyof TTree>();
    this.forEachMatching(event, (key) => keysPressed.push(key));
    return keysPressed;
  }
}

export function isKeyPressed(map: KeyMappingValue, e: PartialKeyEvent) {
  if (map.alt && !e.altKey) return false;
  if (map.ctrl && !e.ctrlKey) return false;
  if (map.meta && !e.metaKey) return false;
  if (map.shift && !e.shiftKey) return false;
  return map.code === e.code;
}
