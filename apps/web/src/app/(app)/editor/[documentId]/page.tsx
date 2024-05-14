"use client";
import {
  Canvas,
  CanvasData,
  CanvasLevelNode,
  CanvasNodeData,
} from "@repo/canvas";
import { useSharedState } from "@repo/utils/hooks";
import { useWindowSize } from "usehooks-ts";

function createInitialNodes(): CanvasNodeData[] {
  return [
    {
      attrs: {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: "red",
        id: Math.random().toString(),
      },
      className: "Rect",
    },
    {
      attrs: {
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: "green",
        id: Math.random().toString(),
      },
      className: "Rect",
    },
    {
      attrs: {
        x: 200,
        y: 200,
        width: 50,
        height: 50,
        fill: "blue",
        id: Math.random().toString(),
      },
      className: "Rect",
    },
  ];
}

export default function EditorPage() {
  const height = 800;

  const data = new CanvasData([
    new CanvasLevelNode(
      "floor_1",
      "https://svgshare.com/i/1602.svg",
      { x: 0, y: 0 },
      useSharedState(createInitialNodes),
    ),
    new CanvasLevelNode(
      "floor_2",
      "https://svgshare.com/i/162B.svg",
      { x: 0, y: height + 50 },
      useSharedState(createInitialNodes),
    ),
    new CanvasLevelNode(
      "floor_3",
      "https://svgshare.com/i/161z.svg",
      { x: 0, y: 2 * (height + 50) },
      useSharedState(createInitialNodes),
    ),
  ]);

  const dimensions = useWindowSize();

  return (
    <Canvas
      width={dimensions.width}
      height={dimensions.height}
      levelDimensions={{ x: 1200, y: height }}
      data={data}
      editable
      movable
    />
  );
}
