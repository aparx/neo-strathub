"use client";
import {
  Canvas,
  CanvasData,
  CanvasLevelNode,
  CanvasNodeData,
} from "@repo/canvas";
import { createShapeData } from "@repo/canvas/src/render/canvasShapes";
import { useSharedState } from "@repo/utils/hooks";
import { useWindowSize } from "usehooks-ts";

function createInitialNodes(): CanvasNodeData[] {
  return [
    createShapeData("Rect", {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: "red",
    }),
    createShapeData("Arrow", {
      points: [10, 10, 100, 10],
      fill: "red",
      stroke: "red",
      tension: 1,
      pointerLength: 10,
      pointerWidth: 12,
      x: 0,
      y: 0,
    }),
    createShapeData("Circle", {
      radius: 100,
      x: 200,
      y: 200,
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
      data={data}
      editable
      movable
    />
  );
}
