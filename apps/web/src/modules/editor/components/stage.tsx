import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle } from "@repo/canvas";
import type Konva from "konva";
import { useMemo } from "react";
import { deleteNodes, upsertNodes } from "../actions";
import {
  CommandHistory,
  EditorCommand,
  createUpdateCommand,
} from "../features/command";
import { createCreateCommand } from "../features/command/commands/createCommand";
import { createDeleteCommand } from "../features/command/commands/deleteCommand";
import { useEditorEventHandler } from "../features/events";
import { useEditorEvent } from "../features/events/hooks";
import { useSubscribeRealtimeEditor } from "../features/realtime";
import { useGetLevels } from "../hooks";
import { EditorLevel } from "./level";

export interface EditorStageStyle {
  levelStyle: CanvasLevelStyle;
  /** Gap between levels */
  levelGap: number;
  /** Used as multipliers in each dimension for each level */
  levelDirection: [x: number, y: number];
}

export interface EditorStageProps {
  blueprint: BlueprintData;
  stageId: number;
  style: EditorStageStyle;
  position: Konva.Vector2d;
}

/** An editor stage is rendered within a canvas and represents a stage */
export function EditorStage({
  blueprint,
  stageId,
  style,
  position,
}: EditorStageProps) {
  const eventHandler = useEditorEventHandler();
  const editor = useEditor();
  const { data } = useGetLevels(blueprint.arena.id);

  // TODO change history for UNDO & REDO

  function createPosition(index: number) {
    const [dx, dy] = style.levelDirection;
    const gap = style.levelGap;

    return {
      x: position.x + index * dx * (style.levelStyle.width + gap),
      y: position.y + index * dy * (style.levelStyle.height + gap),
    } as const satisfies Konva.Vector2d;
  }

  const history = useMemo(() => new CommandHistory<EditorCommand>(5), []);

  useEditorEvent("editorUndo", () => {
    const lastCommand = history.moveBack();
    const negate = lastCommand?.negate();
    if (!negate) return;
    const negateEvent = negate.createEvent();
    eventHandler.fire(negate.eventType, "history", negateEvent);
    editor.channel.broadcast(negate.eventType, negateEvent);
  });

  useEditorEvent("editorRedo", () => {
    const nextCommand = history.moveForward();
    const event = nextCommand?.createEvent();
    if (!event || !nextCommand) return;
    eventHandler.fire(nextCommand.eventType, "history", event);
    editor.channel.broadcast(nextCommand.eventType, event);
  });

  useSubscribeRealtimeEditor(editor.channel, "*", (payload, type) => {
    console.debug("Received foreign event", type, payload);
    eventHandler.fire(type, "foreign", payload);
  });

  function pushCommand(command: EditorCommand) {
    // TODO batch commands
    history.push(command);
    editor.channel.broadcast(command.eventType, command.createEvent());
  }

  return (
    <>
      {data?.map((level, index) => (
        <EditorLevel
          key={level.id}
          id={level.id}
          stageId={stageId}
          imageURL={level.image}
          position={createPosition(index)}
          onNodeUpdate={(newNode, oldNode, origin) => {
            // TODO batch update
            switch (origin) {
              case "user":
                pushCommand(createUpdateCommand(oldNode, newNode));
              //fallthrough
              case "history":
                upsertNodes([newNode], level.id, stageId);
            }
          }}
          onNodeDelete={(node, origin) => {
            // TODO batch deletion
            switch (origin) {
              case "user":
                pushCommand(createDeleteCommand([node], level.id, stageId));
              //fallthrough
              case "history":
                deleteNodes([node.attrs.id]);
            }
          }}
          onNodeCreate={(node, origin) => {
            // TODO batch creation
            switch (origin) {
              case "user":
                pushCommand(createCreateCommand([node], level.id, stageId));
              //fallthrough
              case "history":
                upsertNodes([node], level.id, stageId);
            }
          }}
          style={style.levelStyle}
        />
      ))}
    </>
  );
}
