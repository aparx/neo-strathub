"use client";
import { Nullish } from "@repo/utils";
import { SharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { createContext, CSSProperties, RefObject, useContext } from "react";

export interface CanvasContextInteractStatus {
  editable?: boolean;
  zoomable?: boolean;
  selectable?: boolean;
  movable?: boolean;
}

export interface CanvasContextFunctions {
  onGetGameObjectURL: (id: number, type: string) => string | Nullish;
  onGetCharacterSlot: (characterId: number) => Nullish<{
    color: string;
    objectId?: number;
    self?: boolean;
  }>;
}

export interface CanvasContext
  extends CanvasContextInteractStatus,
    CanvasContextFunctions {
  scale: SharedState<number>;
  position: SharedState<Vector2d>;
  cursor: SharedState<CSSProperties["cursor"]>;
  selected: SharedState<string[]>;
  canvas: RefObject<Konva.Stage>;
}

const canvasContext = createContext<CanvasContext | null>(null);

export function useCanvas(): CanvasContext {
  const ctx = useContext(canvasContext);
  if (!ctx) throw new Error("Missing CanvasContext");
  return ctx;
}

export const CanvasContextProvider = canvasContext.Provider;
