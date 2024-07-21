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