import { KeyboardEventHandler } from "react";

interface Keys {
  code: string;
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
}

export const CANVAS_KEY_MAP = {
  moveLeft: { code: "ArrowLeft" },
  moveRight: { code: "ArrowRight" },
  moveTop: { code: "ArrowUp" },
  moveBottom: { code: "ArrowDown" },
  delete: { code: "Delete" },
  duplicate: { code: "KeyD", ctrl: true },
  snap: { code: "ShiftLeft" },
} satisfies Readonly<Record<string, Keys>>;

export type KeymapKey = keyof typeof CANVAS_KEY_MAP;

export type KeyboardEvent = Parameters<KeyboardEventHandler<HTMLElement>>[0];

export function isPressed(key: KeymapKey, e: KeyboardEvent) {
  const mapping = CANVAS_KEY_MAP[key]! as Keys;
  if (mapping.ctrl && !e.ctrlKey) return false;
  if (mapping.alt && !e.altKey) return false;
  if (mapping.shift && !e.shiftKey) return false;
  return mapping.code === e.code;
}
