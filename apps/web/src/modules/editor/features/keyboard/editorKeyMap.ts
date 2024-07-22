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

  isMatching(key: keyof TTree, event: PartialKeyEvent): boolean {
    const mapping = this.tree[key];
    if (!mapping) throw new Error("Impossible: Key mapping does not exist");
    return isKeyPressed(mapping, event);
  }

  findMatching(event: PartialKeyEvent): keyof TTree | undefined {
    return this._keys.find((key) => this.isMatching(key, event));
  }

  forEachMatching(
    event: PartialKeyEvent,
    callback: (this: EditorKeyMap<TTree>, key: keyof TTree) => void,
  ): void {
    this._keys.forEach((key) => {
      if (!this.isMatching(key, event)) return;
      callback.call(this, key);
    });
  }

  collectMatches(event: PartialKeyEvent): Array<keyof TTree> {
    const keysPressed = new Array<keyof TTree>();
    this.forEachMatching(event, (key) => keysPressed.push(key));
    return keysPressed;
  }
}

export function isKeyPressed(map: KeyMappingValue, event: PartialKeyEvent) {
  if (Boolean(map.alt) !== Boolean(event.altKey)) return false;
  if (Boolean(map.ctrl) !== Boolean(event.ctrlKey)) return false;
  if (Boolean(map.meta) !== Boolean(event.metaKey)) return false;
  if (Boolean(map.shift) !== Boolean(event.shiftKey)) return false;
  return map.code === event.code;
}
