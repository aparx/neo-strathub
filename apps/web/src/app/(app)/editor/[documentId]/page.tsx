"use client";
import { Canvas } from "@repo/canvas";
import { useSharedState } from "@repo/utils/hooks";
import type Konva from "konva";

const initialNodes: Konva.RectConfig[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
  {
    x: 200,
    y: 200,
    width: 50,
    height: 50,
    fill: "blue",
    id: "rect3",
  },
];

export default function EditorPage() {
  return (
    <Canvas
      elements={useSharedState(initialNodes)}
      imageBackground={"https://svgshare.com/i/1602.svg"}
    />
  );
}
