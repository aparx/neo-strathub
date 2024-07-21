import { DeepReadonly } from "@repo/utils";

export interface KeyMappingValue {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  code?: string;
}

export type EditorKeybindTree = DeepReadonly<
  KeybindMappings<
    | "delete"
    | "moveLeft"
    | "moveRight"
    | "moveUp"
    | "moveDown"
    | "duplicate"
    | "undo"
    | "redo"
    | "close"
    | "stageBack"
    | "stageNext"
    | "copy"
    | "paste"
    | "cut"
  >
>;

type KeybindMappings<TName extends string> = Record<TName, KeyMappingValue>;

export const DEFAULT_KEY_TREE: EditorKeybindTree = {
  delete: { code: "Delete" },
  moveLeft: { code: "ArrowLeft" },
  moveRight: { code: "ArrowRight" },
  moveUp: { code: "ArrowUp" },
  moveDown: { code: "ArrowDown" },
  duplicate: { code: "KeyD", ctrl: true },
  undo: { code: "KeyY", ctrl: true },
  redo: { code: "KeyZ", ctrl: true },
  close: { code: "Escape" },
  stageBack: { code: "KeyQ" },
  stageNext: { code: "KeyE" },
  copy: { code: "KeyC", ctrl: true },
  cut: { code: "KeyX", ctrl: true },
  paste: { code: "KeyV", ctrl: true },
} as const;

type KeyEvent = Partial<
  Pick<
    React.KeyboardEvent,
    "altKey" | "ctrlKey" | "metaKey" | "shiftKey" | "code"
  >
>;

type ReadonlyTree = DeepReadonly<EditorKeybindTree>;

export type InferKeyMapKeys<T> =
  T extends EditorKeyMap<infer TTree>
    ? keyof TTree
    : T extends EditorKeybindTree
      ? keyof T
      : "Cannot infer keyboard keys";

export class EditorKeyMap<TTree extends ReadonlyTree = ReadonlyTree> {
  public static DEFAULT_MAP = new EditorKeyMap(DEFAULT_KEY_TREE);

  private readonly _keys: Array<keyof TTree>;

  constructor(public readonly tree: TTree) {
    // Get keys on initial construction, to avoid constant O(n)
    this._keys = Object.keys(tree) as typeof this._keys;
  }

  isMatching(key: keyof TTree, event: KeyEvent): boolean {
    const mapping = this.tree[key];
    if (!mapping) throw new Error("Impossible: Key mapping does not exist");
    return isKeyPressed(mapping, event);
  }

  findMatching(event: KeyEvent): keyof TTree | undefined {
    return this._keys.find((key) => this.isMatching(key, event));
  }

  forEachMatching(
    event: KeyEvent,
    callback: (this: EditorKeyMap<TTree>, key: keyof TTree) => void,
  ): void {
    const _callback = callback.bind(this);
    this._keys.forEach((key) => {
      if (!this.isMatching(key, event)) return;
      _callback.call(this, key);
    });
  }

  collectMatches(event: KeyEvent): Array<keyof TTree> {
    const keysPressed = new Array<keyof TTree>();
    this.forEachMatching(event, (key) => keysPressed.push(key));
    return keysPressed;
  }
}

export function isKeyPressed(map: KeyMappingValue, e: KeyEvent) {
  if (map.alt && !e.altKey) return false;
  if (map.ctrl && !e.ctrlKey) return false;
  if (map.meta && !e.metaKey) return false;
  if (map.shift && !e.shiftKey) return false;
  return map.code === e.code;
}
