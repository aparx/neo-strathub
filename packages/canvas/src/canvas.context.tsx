import { SharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { createContext, useContext } from "react";
import { CanvasData, CanvasLevelNode } from "./canvas.data";

// ROOT CONTEXT

export interface CanvasRootContext<
  TNode extends Konva.NodeConfig = Konva.NodeConfig,
> {
  selected: SharedState<string[]>;
  snapping: SharedState<boolean>;
  data: CanvasData<TNode>;

  isSelected(id: string): boolean;

  stage(): Konva.Stage;
}

const canvasRootContext = createContext<CanvasRootContext<any> | null>(null);

export const CanvasRootContextProvider = canvasRootContext.Provider;

export function useCanvas<
  TNode extends Konva.NodeConfig = Konva.NodeConfig,
>(): CanvasRootContext<TNode> {
  const ctx = useContext(canvasRootContext);
  if (!ctx) throw new Error("Missing CanvasRootContext");
  return ctx;
}

// LEVEL CONTEXT

const canvasLevelContext = createContext<CanvasLevelNode<any> | null>(null);

export const CanvasLevelContextProvider = canvasLevelContext.Provider;

export function useCanvasLevel<
  TNode extends Konva.NodeConfig = Konva.NodeConfig,
>(): CanvasLevelNode<TNode> {
  const ctx = useContext(canvasLevelContext);
  if (!ctx) throw new Error("Missing CanvasLevelContext");
  return ctx;
}
