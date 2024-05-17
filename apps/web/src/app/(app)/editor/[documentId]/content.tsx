"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import {
  Canvas,
  CanvasData,
  CanvasLevelNode,
  CanvasNodeData,
  CanvasRef,
  createShapeData,
} from "@repo/canvas";
import { PRIMITIVE_CANVAS_SHAPES } from "@repo/canvas/src/render/canvasShapes";
import { useSharedState } from "@repo/utils/hooks";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
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

export function EditorContent({ params }: { params: { documentId: string } }) {
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
  const canvasRef = useRef<CanvasRef>(null);

  useEffect(() => {
    // Apply local storage position and zoom
    const canvas = canvasRef.current;
    if (!canvas) return;
    const zoomStr = localStorage.getItem("canvas_zoom");
    if (zoomStr) canvas.scale.update(Number(zoomStr));
    const posStr = localStorage.getItem("canvas_pos");
    if (posStr) canvas.position.update(JSON.parse(posStr));
  }, []);

  const storeZoom = useDebouncedCallback((scale: number) => {
    localStorage.setItem("canvas_zoom", scale);
  }, 250);

  const storePos = useDebouncedCallback((pos: { x: number; y: number }) => {
    localStorage.setItem("canvas_pos", JSON.stringify(pos));
  }, 250);

  return (
    <main>
      <div className={css.fadeInRect} />
      <Canvas
        ref={canvasRef}
        onMove={storePos}
        onZoom={storeZoom}
        width={dimensions.width}
        height={dimensions.height}
        modifiable
        levelDimensions={{ x: 1200, y: height }}
        lookupTable={shapeRenderers}
        data={data}
        editable
        movable
      />
    </main>
  );
}
