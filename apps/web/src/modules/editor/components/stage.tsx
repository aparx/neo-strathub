import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle, useCanvas } from "@repo/canvas";
import type Konva from "konva";
import { useEffect } from "react";
import { deleteNodes, upsertNodes } from "../actions";
import { EditorCommand } from "../features/command";
import {
  GetLevelData,
  useGetLevels,
  usePushDelete,
  usePushInsert,
  usePushUpdate,
} from "../hooks";
import { EditorLevel } from "./level";
import { useEditorEvent } from "../features/events/hooks";

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
  hidden?: boolean;
}

/** An editor stage is rendered within a canvas and represents a stage */
export function EditorStage({
  blueprint,
  stageId,
  style,
  position,
  hidden,
}: EditorStageProps) {
  const canvas = useCanvas();
  const [editor] = useEditorContext();
  const { data } = useGetLevels(blueprint.arena.id);

  function createPosition(index: number) {
    const [dx, dy] = style.levelDirection;
    const gap = style.levelGap;

    return {
      x: position.x + index * dx * (style.levelStyle.width + gap),
      y: position.y + index * dy * (style.levelStyle.height + gap),
    } as const satisfies Konva.Vector2d;
  }

  // Fix: https://github.com/aparx/neo-strathub/issues/32
  useEffect(() => canvas.selected.update([]), [hidden]);

  function sendCommand(command: EditorCommand) {
    editor.history.push(command);
    editor.channel.broadcast(command.eventType, command.payload);
  }

  const pushUpdate = usePushUpdate({
    userPush: sendCommand,
    commitToDb: (nodes, levelId) => upsertNodes(nodes, levelId, stageId),
  });

  const pushDelete = usePushDelete({
    stageId,
    userPush: sendCommand,
    commitToDb: (nodes) => deleteNodes(nodes),
  });

  const pushInsert = usePushInsert({
    stageId,
    userPush: sendCommand,
    commitToDb: (nodes, levelId) => upsertNodes(nodes, levelId, stageId),
  });

  return data?.map((level, index) => (
    <Level
      key={level.id}
      stageId={stageId}
      position={createPosition(index)}
      level={level}
      style={style.levelStyle}
      hidden={hidden}
      onUpdate={pushUpdate}
      onDelete={pushDelete}
      onInsert={pushInsert}
    />
  ));
}

function Level({
  level,
  stageId,
  position,
  style,
  hidden,
  onUpdate,
  onDelete,
  onInsert,
}: {
  level: GetLevelData;
  stageId: number;
  position: Konva.Vector2d;
  style: CanvasLevelStyle;
  hidden?: boolean;
  onUpdate: ReturnType<typeof usePushUpdate>;
  onDelete: ReturnType<typeof usePushDelete>;
  onInsert: ReturnType<typeof usePushInsert>;
}) {
  return (
    <EditorLevel
      key={level.id}
      id={level.id}
      index={level.index}
      stageId={stageId}
      imageURL={level.image}
      position={position}
      onNodeUpdate={(newNode, oldNode, origin) =>
        origin !== "foreign" &&
        onUpdate({
          origin,
          oldNode,
          newNode,
          level: level.id,
        })
      }
      onNodeDelete={(node, origin) =>
        origin !== "foreign" &&
        onDelete({
          node,
          origin,
          level: level.id,
        })
      }
      onNodeCreate={(node, origin) =>
        origin !== "foreign" &&
        onInsert({
          node,
          origin,
          level: level.id,
        })
      }
      style={style}
      hidden={hidden}
    />
  );
}
