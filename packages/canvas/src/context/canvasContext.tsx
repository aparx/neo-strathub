import { SharedState } from "@repo/utils/hooks";
import { Vector2d } from "konva/lib/types";
import { createContext, CSSProperties, useContext } from "react";

export interface CanvasContext {
  scale: SharedState<number>;
  position: SharedState<Vector2d>;
  cursor: SharedState<CSSProperties["cursor"]>;
  selected: SharedState<string[]>;
}

const canvasContext = createContext<CanvasContext | null>(null);

export function useCanvas(): CanvasContext {
  const ctx = useContext(canvasContext);
  if (!ctx) throw new Error("Missing CanvasContext");
  return ctx;
}

export const CanvasContextProvider = canvasContext.Provider;
