import { DeepReadonly } from "@repo/utils";

export interface KeyMappingValue {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  code?: string;
}

export type EditorKeyMapTree = DeepReadonly<{
  canvas: KeybindMappings<
    | "delete"
    | "moveLeft"
    | "moveRight"
    | "moveUp"
    | "moveDown"
    | "duplicate"
    | "copy"
    | "paste"
    | "cut"
  >;
  editor: KeybindMappings<
    "undo" | "redo" | "close" | "stageBack" | "stageNext"
  >;
}>;

type KeybindMappings<TName extends string> = Record<TName, KeyMappingValue>;

export const DEFAULT_KEY_MAP: EditorKeyMapTree = {
  canvas: {
    delete: { code: "Delete" },
    moveLeft: { code: "ArrowLeft" },
    moveRight: { code: "ArrowRight" },
    moveUp: { code: "ArrowUp" },
    moveDown: { code: "ArrowDown" },
    duplicate: { code: "KeyD", ctrl: true },
    copy: { code: "KeyC", ctrl: true },
    cut: { code: "KeyX", ctrl: true },
    paste: { code: "KeyV", ctrl: true },
  },
  editor: {
    undo: { code: "KeyY", ctrl: true },
    redo: { code: "KeyZ", ctrl: true },
    close: { code: "Escape" },
    stageBack: { code: "KeyQ" },
    stageNext: { code: "KeyE" },
  },
} as const;

export function isKeyPressed(map: KeyMappingValue, e: React.KeyboardEvent) {
  if (map.alt && !e.altKey) return false;
  if (map.ctrl && !e.ctrlKey) return false;
  if (map.meta && !e.metaKey) return false;
  if (map.shift && !e.shiftKey) return false;
  return map.code === e.code;
}
