import { DeepReadonly } from "@repo/utils";
import {
  DEFAULT_KEY_TREE,
  EditorKeybindTree,
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
    : T extends EditorKeybindTree
      ? keyof T
      : "Cannot infer keyboard keys";

type ReadonlyTree = DeepReadonly<EditorKeybindTree>;

export class EditorKeyMap<TTree extends ReadonlyTree = ReadonlyTree> {
  public static DEFAULT_MAP = new EditorKeyMap(DEFAULT_KEY_TREE);

  private readonly _keys: Array<keyof TTree>;

  constructor(public readonly tree: TTree) {
    // Get keys on initial construction, to avoid constant O(n)
    this._keys = Object.keys(tree) as typeof this._keys;
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

export function isKeyPressed(map: KeyMappingValue, e: PartialKeyEvent) {
  if (map.alt && !e.altKey) return false;
  if (map.ctrl && !e.ctrlKey) return false;
  if (map.meta && !e.metaKey) return false;
  if (map.shift && !e.shiftKey) return false;
  return map.code === e.code;
}
