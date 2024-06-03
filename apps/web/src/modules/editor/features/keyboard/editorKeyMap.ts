import { DeepReadonly } from "@repo/utils";

export type KeyboardKeyMap = typeof DEFAULT_KEY_MAP;

export interface KeyMappingValue {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  code?: string;
}

export type EditorKeyMapTree = DeepReadonly<{
  canvas: {
    delete: KeyMappingValue;
    moveLeft: KeyMappingValue;
    moveRight: KeyMappingValue;
    moveUp: KeyMappingValue;
    moveDown: KeyMappingValue;
    duplicate: KeyMappingValue;
  };
}>;

export const DEFAULT_KEY_MAP: EditorKeyMapTree = {
  canvas: {
    delete: { code: "Delete" },
    moveLeft: { code: "ArrowLeft" },
    moveRight: { code: "ArrowRight" },
    moveUp: { code: "ArrowUp" },
    moveDown: { code: "ArrowDown" },
    duplicate: { code: "KeyD", ctrl: true },
  },
} as const;

export function isKeyPressed(map: KeyMappingValue, e: React.KeyboardEvent) {
  if (map.alt && !e.altKey) return false;
  if (map.ctrl && !e.ctrlKey) return false;
  if (map.meta && !e.metaKey) return false;
  if (map.shift && !e.shiftKey) return false;
  return map.code === e.code;
}
