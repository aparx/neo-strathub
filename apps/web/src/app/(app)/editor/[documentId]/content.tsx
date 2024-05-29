"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import {
  EditorStage,
  EditorStageLevel,
} from "@/modules/editor/partial/editor.stage";
import { ArenaLevelData } from "@/modules/game/actions";
import {
  CanvasNodeConfig,
  CanvasNodeData,
  CanvasRef,
  createShapeData,
} from "@repo/canvas";
import { PRIMITIVE_CANVAS_SHAPES } from "@repo/canvas/src/render/canvasShapes";
import Konva from "konva";
import { useEffect, useMemo, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { useGetObjects } from "./_hooks";
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
  ];
}

export function EditorContent({
  levels,
  blueprint,
  stageId,
}: {
  levels: ArenaLevelData[];
  blueprint: BlueprintData;
  stageId: number;
}) {
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

  const objectQuery = useGetObjects(
    blueprint.id,
    stageId,
    useMemo(() => levels.map((level) => level.id), [levels]),
  );

  const finalLevels: EditorStageLevel[] = useMemo(() => {
    const objectMap = objectQuery.data;
    if (!objectMap) return [];
    return levels.map((level) => ({
      id: level.id,
      image: level.image,
      nodes:
        objectMap.get(level.id)?.map((x) => ({
          attrs: {
            ...(x.attributes as Omit<CanvasNodeConfig, "id">),
            id: x.id,
          } satisfies CanvasNodeConfig,
          className: x.classname,
        })) ?? [],
    }));
  }, [objectQuery.data]);

  // https://svgshare.com/i/161z.svg
  // https://svgshare.com/i/162B.svg
  // https://svgshare.com/i/1602.svg

  return (
    <main>
      <div className={css.fadeInRect} />
      <EditorStage
        ref={canvasRef}
        movable
        editable
        renderers={PRIMITIVE_CANVAS_SHAPES}
        onMove={useDebouncedCallback(setPos, 250)}
        onZoom={useDebouncedCallback(setZoom, 250)}
        onEvent={(type, level, node) => {
          // TODO BATCH UPDATES
          console.log("update", type, level.id, node);
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
          levels: finalLevels,
        }}
      />
    </main>
  );
}
