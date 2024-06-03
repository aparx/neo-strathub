import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle } from "@repo/canvas";
import type Konva from "konva";
import { useMemo } from "react";
import { saveNode } from "../actions";
import {
  CommandHistory,
  createUpdateCommand,
  EditorCommand,
} from "../features/command";
import { useEditorEventHandler } from "../features/events";
import { useEditorEvent } from "../features/events/hooks";
import { useGetLevels } from "../hooks";
import { useRealtimeEditorHandle } from "../utils";
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
    eventHandler.fire(negate.eventType, "history", negate.createEvent());
  });

  useEditorEvent("editorRedo", () => {
    console.log("try redo");
    const nextCommand = history.moveForward();
    console.log("next", history.cursor(), nextCommand);
    const event = nextCommand?.createEvent();
    if (!event || !nextCommand) return;
    eventHandler.fire(nextCommand.eventType, "history", event);
  });

  useRealtimeEditorHandle(editor.channel, "emitEvent", (data) => {
    eventHandler.fire(data.type, "foreign", data.event);
  });

  function pushCommand(command: EditorCommand) {
    history.push(command);
    editor.channel.broadcast("emitEvent", {
      type: command.eventType,
      event: command.createEvent(),
    });
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
            switch (origin) {
              case "user":
                pushCommand(createUpdateCommand(oldNode, newNode));
              //fallthrough
              case "history":
                saveNode(newNode);
            }
          }}
          onNodeDelete={(node) => {
            // TODO batch deletion
            console.log("delete node", node);
          }}
          onNodeCreate={(node) => {
            // TODO batch creation
            console.log("create node", node);
          }}
          style={style.levelStyle}
        />
      ))}
    </>
  );
}
