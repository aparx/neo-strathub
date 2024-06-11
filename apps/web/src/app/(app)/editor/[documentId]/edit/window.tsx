"use client";
import { EditorStage } from "@/modules/editor/components/stage";
import { EditorViewport } from "@/modules/editor/components/viewport";
import { useEditorEventHandler } from "@/modules/editor/features/events";
import { NodeTags, getLevelLayerAtCursor } from "@repo/canvas";
import { CanvasContext } from "@repo/canvas/src/context/canvasContext";
import { useEffect, useRef } from "react";
import { useWindowSize } from "usehooks-ts";
import { useEditor } from "../_context";
import { EditorConfig } from "../_utils";

export function EditorEditContent({ stageId }: { stageId: number }) {
  const windowSize = useWindowSize();
  const [editor, updateEditor] = useEditor();
  const eventHandler = useEditorEventHandler();
  // https://svgshare.com/i/161z.svg
  // https://svgshare.com/i/162B.svg
  // https://svgshare.com/i/1602.svg

  const canvasRef = useRef<CanvasContext>(null);

  useEffect(() => {
    updateEditor((old) => ({
      ...old,
      editable: true,
      selectable: true,
    }));
  }, []);

  return (
    <main
      onDragOver={(e) => {
        e.preventDefault();
        const stage = canvasRef.current?.canvas.current;
        if (!stage) return;
        const level = getLevelLayerAtCursor(stage, e.clientX, e.clientY);
        if (level)
          updateEditor((oldContext) => ({
            ...oldContext,
            focusedLevel: Number(level.id()),
          }));
      }}
      onDrop={(e) => {
        const stage = canvasRef.current?.canvas.current;
        const node = editor.dragged;
        if (!stage || !node) return;
        let targetLevelId = editor.focusedLevel;
        const layer = stage.children.find((layer) =>
          targetLevelId
            ? layer.id() === String(targetLevelId)
            : layer.hasName(NodeTags.LEVEL_LAYER),
        );
        if (!layer) throw new Error("Could not find level layer");
        stage.setPointersPositions(e);
        const relPos = layer.getRelativePointerPosition();
        if (!relPos) throw new Error("Could not determine cursor position");

        // Update the node's position to be relative to the target level
        const config = node.attrs;
        const maxX = EditorConfig.LEVEL_STYLE.width - (config.width ?? 0);
        const maxY = EditorConfig.LEVEL_STYLE.height - (config.height ?? 0);
        config.x = relPos.x - (config.width ? config.width / 2 : 0);
        config.y = relPos.y - (config.height ? config.height / 2 : 0);
        config.x = Math.max(0, Math.min(config.x, maxX));
        config.y = Math.max(0, Math.min(config.y, maxY));

        // Push node as event, that the target level processes further
        eventHandler.fire("canvasDrop", "user", {
          nodes: [node],
          levelId: Number(layer.id()),
          stageId,
        });
      }}
    >
      <EditorViewport
        ref={canvasRef}
        zoomable={editor.zoomable}
        editable={editor.editable}
        movable={editor.movable}
        selectable={editor.selectable}
        style={{
          width: windowSize.width,
          height: windowSize.height,
          selectionColor: `rgba(${EditorConfig.FOCUS_COLOR.join(", ")}, .5)`,
        }}
      >
        <EditorStage
          blueprint={editor.blueprint}
          stageId={stageId}
          position={{ x: 0, y: 0 }}
          style={EditorConfig.STAGE_STYLE}
        />
      </EditorViewport>
    </main>
  );
}