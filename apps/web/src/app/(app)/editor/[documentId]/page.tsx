"use client";
import {
  Canvas,
  CanvasData,
  CanvasLevelNode,
  CanvasNodeData,
} from "@repo/canvas";
import { createShapeData } from "@repo/canvas/src/render";
import { PRIMITIVE_CANVAS_SHAPES } from "@repo/canvas/src/render/canvasShapes";
import { useSharedState } from "@repo/utils/hooks";
import { useWindowSize } from "usehooks-ts";

const shapeRenderers = PRIMITIVE_CANVAS_SHAPES;

function createInitialNodes(): CanvasNodeData[] {
  return [
    createShapeData(shapeRenderers, "Line", {
      points: [10, 10, 100, 50, 200, 0],
      fill: "red",
      stroke: "red",
      tension: 0,
      strokeWidth: 5,
      x: 0,
      y: 0,
    }),
    createShapeData(shapeRenderers, "Circle", {
      radius: 25,
      x: 50,
      y: 50,
      fill: "green",
    }),
  ];
}

export default function EditorPage() {
  const height = 800;

  const data = new CanvasData([
    new CanvasLevelNode(
      "stage_1_floor_3",
      "https://svgshare.com/i/161z.svg",
      { x: 0, y: 2 * (height + 50) },
      useSharedState(createInitialNodes),
    ),
    new CanvasLevelNode(
      "stage_1_floor_2",
      "https://svgshare.com/i/162B.svg",
      { x: 0, y: height + 50 },
      useSharedState(createInitialNodes),
    ),
    new CanvasLevelNode(
      "stage_1_floor_1",
      "https://svgshare.com/i/1602.svg",
      { x: 0, y: 0 },
      useSharedState(createInitialNodes),
    ),
  ]);

  const dimensions = useWindowSize();

  return (
    <Canvas
      width={dimensions.width}
      height={dimensions.height}
      modifiable
      levelDimensions={{ x: 1200, y: height }}
      lookupTable={shapeRenderers}
      data={data}
      editable
      movable
    />
  );
}
