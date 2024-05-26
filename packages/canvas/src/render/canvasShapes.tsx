import { nonNull } from "@repo/utils";
import Konva from "konva";
import { RefObject, useEffect } from "react";
import { Arrow, Circle, Line, Rect } from "./shapes";

export function usePutNodesIntoTransformer(
  insertNodes: boolean,
  transformer: RefObject<Konva.Transformer>,
  ...nodes: RefObject<Konva.Node>[]
) {
  useEffect(() => {
    if (insertNodes && nodes.length)
      transformer.current?.nodes(nodes.map((x) => x.current).filter(nonNull));
    else transformer.current?.nodes([]);
    transformer.current?.getLayer()?.batchDraw();
  }, [insertNodes]);
}

export const PRIMITIVE_CANVAS_SHAPES = {
  Rect,
  Circle,
  Arrow,
  Line,
} as const;
