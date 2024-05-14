import { KeyboardEventHandler } from "react";

interface Keys {
  codes: string[];
  alt?: boolean;
  ctrl?: boolean;
  shift?: boolean;
}

export const CANVAS_KEY_MAP = {
  moveLeft: { codes: ["ArrowLeft"] },
  moveRight: { codes: ["ArrowRight"] },
  moveTop: { codes: ["ArrowUp"] },
  moveBottom: { codes: ["ArrowDown"] },
  delete: { codes: ["Delete", "Backspace"] },
  duplicate: { codes: ["KeyD"], ctrl: true },
  snap: { codes: ["ShiftLeft"] },
  selectAll: { codes: ["KeyA"], ctrl: true },
  copy: { codes: ["KeyC"], ctrl: true },
  cut: { codes: ["KeyX"], ctrl: true },
  paste: { codes: ["KeyV"], ctrl: true },
} satisfies Readonly<Record<string, Keys>>;

export type KeymapKey = keyof typeof CANVAS_KEY_MAP;

export type KeyboardEvent = Parameters<KeyboardEventHandler<HTMLElement>>[0];

export function isPressed(key: KeymapKey, e: KeyboardEvent) {
  const mapping = CANVAS_KEY_MAP[key]! as Keys;
  if (mapping.ctrl && !e.ctrlKey) return false;
  if (mapping.alt && !e.altKey) return false;
  if (mapping.shift && !e.shiftKey) return false;
  return mapping.codes.includes(e.code);
}
