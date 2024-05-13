import { SharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { createContext, useContext } from "react";

export interface CanvasContext {
  elements: SharedState<Konva.NodeConfig[]>;
  selected: SharedState<string[]>;
  snapping: SharedState<boolean>;

  /** Returns the canvas layer reference */
  layer(): Konva.Layer;

  /** Returns the canvas stage reference */
  stage(): Konva.Stage;

  /** Returns true if `id` is marked selected */
  isSelected(id: string): boolean;
}

const canvasContext = createContext<CanvasContext | null>(null);

export function useCanvasContext() {
  const context = useContext(canvasContext);
  if (!context) throw new Error("Missing CanvasContext");
  return context;
}

export const CanvasContextProvider = canvasContext.Provider;
