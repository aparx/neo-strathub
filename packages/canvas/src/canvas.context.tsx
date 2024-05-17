import { SharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { createContext, CSSProperties, RefObject, useContext } from "react";
import { CanvasData, CanvasLevelNode, CanvasNodeData } from "./canvas.data";

// ROOT CONTEXT

export interface CanvasRootContext<
  TNode extends CanvasNodeData = CanvasNodeData,
> {
  cursor: SharedState<CSSProperties["cursor"]>;
  scale: SharedState<number>;
  selected: SharedState<string[]>;
  snapping: SharedState<boolean>;
  focusedLevel: SharedState<string | undefined>;
  data: CanvasData<TNode>;
  isSelected: (id: string) => boolean;
  stage: () => Konva.Stage;
}

const canvasRootContext = createContext<CanvasRootContext<any> | null>(null);

export const CanvasRootContextProvider = canvasRootContext.Provider;

export function useCanvas<
  TNode extends CanvasNodeData = CanvasNodeData,
>(): CanvasRootContext<TNode> {
  const ctx = useContext(canvasRootContext);
  if (!ctx) throw new Error("Missing CanvasRootContext");
  return ctx as CanvasRootContext<any>;
}

// LEVEL CONTEXT

export interface CanvasLevelContext<
  TNode extends CanvasNodeData = CanvasNodeData,
> extends CanvasLevelNode<TNode> {
  ref: RefObject<Konva.Layer>;
}

const canvasLevelContext = createContext<CanvasLevelContext<any> | null>(null);

export const CanvasLevelContextProvider = canvasLevelContext.Provider;

export function useCanvasLevel<
  TNode extends CanvasNodeData = CanvasNodeData,
>(): CanvasLevelContext<TNode> {
  const ctx = useContext(canvasLevelContext);
  if (!ctx) throw new Error("Missing CanvasLevelContext");
  return ctx as CanvasLevelContext<any>;
}
