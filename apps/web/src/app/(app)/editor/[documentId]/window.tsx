"use client";
import { LAYER_STAGE_ATTR_KEY } from "@/modules/editor/components/level";
import { EditorStage } from "@/modules/editor/components/stage";
import { EditorViewport } from "@/modules/editor/components/viewport";
import { useEditorEventHandler } from "@/modules/editor/features/events";
import { useEditorEvent } from "@/modules/editor/features/events/hooks";
import { useSubscribeRealtimeEditor } from "@/modules/editor/features/realtime";
import { NodeTags, getLevelLayerAtCursor } from "@repo/canvas";
import { CanvasContext } from "@repo/canvas/context";
import { useMemo, useRef } from "react";
import { useWindowSize } from "usehooks-ts";
import { useEditorContext } from "./_context";
import { EditorConfig } from "./_utils";

export interface EditorWindowProps {
  stages: Array<{
    shown?: boolean;
    id: number;
  }>;
}

export function EditorWindow({ stages }: EditorWindowProps) {
  const windowSize = useWindowSize();
  const [editor, updateEditor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const canvasRef = useRef<CanvasContext>(null);

  useEditorEvent("editorUndo", async (e) => {
    if (e.origin !== "user") return;
    const lastCommand = editor.history.moveBack();
    const negatePromise = lastCommand?.negate();
    if (!negatePromise) return;
    const negate = await negatePromise;
    eventHandler.fire(negate.eventType, "history", negate.payload);
    editor.channel.broadcast(negate.eventType, negate.payload);
  });

  useEditorEvent("editorRedo", (e) => {
    if (e.origin !== "user") return;
    const nextCommand = editor.history.moveForward();
    const event = nextCommand?.payload;
    if (!event || !nextCommand) return;
    eventHandler.fire(nextCommand.eventType, "history", event);
    editor.channel.broadcast(nextCommand.eventType, event);
  });

  useSubscribeRealtimeEditor(editor.channel, "*", (payload, type) => {
    console.debug("Received foreign event", type, payload);
    eventHandler.fire(type, "foreign", payload);
  });

  return (
    <main
      style={{ position: "absolute", left: 0, right: 0 }}
      onDragOver={(e) => {
        if (!editor.editable) return;
        e.preventDefault();
        const stage = canvasRef.current?.canvas.current;
        if (!stage) return;
        const level = getLevelLayerAtCursor(stage, e.clientX, e.clientY);
        if (level)
          updateEditor((oldContext) => ({
            ...oldContext,
            focusedLevel: {
              levelId: Number(level.id()),
              stageId: Number(level.getAttr(LAYER_STAGE_ATTR_KEY)),
            },
          }));
      }}
      onDrop={(e) => {
        if (!editor.editable) return;
        const stage = canvasRef.current?.canvas.current;
        const node = editor.dragged;
        if (!stage || !node) return;
        const focused = editor.focusedLevel;
        const layer = stage.children.find((layer) =>
          focused
            ? Number(layer.id()) === focused.levelId &&
              Number(layer.getAttr(LAYER_STAGE_ATTR_KEY)) === focused.stageId
            : layer.hasName(NodeTags.LEVEL_LAYER),
        );
        if (!layer) throw new Error("Could not find level layer");
        stage.setPointersPositions(e);
        const stageId = Number(layer.getAttr(LAYER_STAGE_ATTR_KEY));
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
        config={{
          width: windowSize.width,
          height: windowSize.height,
          selectionColor: `rgba(${EditorConfig.FOCUS_COLOR.join(", ")}, .5)`,
          maxZoomScale: EditorConfig.MAX_ZOOM_SCALE,
          minZoomScale: EditorConfig.MIN_ZOOM_SCALE,
        }}
      >
        <StageList stages={stages} />
      </EditorViewport>
    </main>
  );
}

function StageList({ stages }: { stages: EditorWindowProps["stages"] }) {
  const [{ blueprint }] = useEditorContext();
  return useMemo(() => {
    let showCounter = 0;
    const width = EditorConfig.LEVEL_STYLE.width;
    const gap = EditorConfig.STAGE_STYLE.levelGap;

    return stages.map((stage) => {
      const posIndex = stage.shown ? showCounter++ : showCounter;
      return (
        <EditorStage
          blueprint={blueprint}
          stageId={stage.id}
          position={{ x: posIndex * (width + gap), y: 0 }}
          style={EditorConfig.STAGE_STYLE}
          hidden={!stage.shown}
        />
      );
    });
  }, [JSON.stringify(stages)]);
}
