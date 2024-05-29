"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { EditorStage } from "@/modules/editor/partial/editor.stage";
import { CanvasNodeData, CanvasRef, createShapeData } from "@repo/canvas";
import { PRIMITIVE_CANVAS_SHAPES } from "@repo/canvas/src/render/canvasShapes";
import Konva from "konva";
import { useEffect, useMemo, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import Vector2d = Konva.Vector2d;

const shapeRenderers = PRIMITIVE_CANVAS_SHAPES;

function createInitialNodes(): CanvasNodeData[] {
  return [
    createShapeData(shapeRenderers, "Line", {
      points: [10, 10, 100, 50, 200, 0],
      fill: "red",
      stroke: "red",
      lineCap: "round",
      lineJoin: "round",
      tension: 0,
      strokeWidth: 5,
      x: 0,
      y: 0,
    }),
    createShapeData(shapeRenderers, "Circle", {
      width: 30,
      height: 30,
      x: 50,
      y: 50,
      fill: "yellow",
    }),
    createShapeData(shapeRenderers, "Arrow", {
      width: 30,
      height: 30,
      x: 100,
      y: 100,
      strokeWidth: 5,
      lineCap: "round",
      lineJoin: "round",
      tension: 0,
      stroke: "green",
      points: [100, 100, 180, 100],
      pointerLength: 20,
      pointerWidth: 20,
      fill: "green",
    }),
  ];
}

export function EditorContent() {
  const windowSize = useWindowSize();
  const canvasRef = useRef<CanvasRef>(null);
  const [zoom, setZoom] = useLocalStorage<number | null>("canvas_zoom", null);
  const [pos, setPos] = useLocalStorage<Vector2d | null>("canvas_pos", null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Apply local storage position and zoom
    if (zoom) canvas?.scale.update(zoom);
    if (pos) canvas?.position.update(pos);
  }, []);

  return (
    <main>
      <div className={css.fadeInRect} />
      <EditorStage
        ref={canvasRef}
        movable
        editable
        lookupTable={PRIMITIVE_CANVAS_SHAPES}
        onMove={useDebouncedCallback(setPos, 250)}
        onZoom={useDebouncedCallback(setZoom, 250)}
        onLevelEvent={(level, type, nodes) => {
          console.log("push update", level, type, nodes.length);
        }}
        preferences={{
          canvasWidth: windowSize.width,
          canvasHeight: windowSize.height,
          levelPosMultipliers: [0, 1],
          levelWidth: 1200,
          levelHeight: 800,
          levelPadding: 20,
          levelGap: 50,
        }}
        stage={{
          id: 1,
          levels: useMemo(
            () => [
              {
                id: 300,
                image: "https://svgshare.com/i/161z.svg",
                nodes: createInitialNodes(),
              },
              {
                id: 301,
                image: "https://svgshare.com/i/162B.svg",
                nodes: createInitialNodes(),
              },
              {
                id: 302,
                image: "https://svgshare.com/i/1602.svg",
                nodes: createInitialNodes(),
              },
            ],
            [],
          ),
        }}
      />
    </main>
  );
}
