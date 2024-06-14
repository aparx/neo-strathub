import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle, CanvasNode, useCanvas } from "@repo/canvas";
import type Konva from "konva";
import { useEffect } from "react";
import { deleteNodes, upsertNodes } from "../actions";
import { EditorCommand, createUpdateCommand } from "../features/command";
import { createCreateCommand } from "../features/command/commands/createCommand";
import { createDeleteCommand } from "../features/command/commands/deleteCommand";
import { EditorEventOrigin } from "../features/events";
import { GetLevelData, useGetLevels } from "../hooks";
import { useBatch } from "../hooks/useBatch";
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
  const { data } = useGetLevels(blueprint.arena.id);

  function createPosition(index: number) {
    const [dx, dy] = style.levelDirection;
    const gap = style.levelGap;

    return {
      x: position.x + index * dx * (style.levelStyle.width + gap),
      y: position.y + index * dy * (style.levelStyle.height + gap),
    } as const satisfies Konva.Vector2d;
  }

  // Fixes https://github.com/aparx/neo-strathub/issues/32
  useEffect(() => canvas.selected.update([]), [hidden]);

  return data?.map((level, index) => (
    <Level
      key={level.id}
      stageId={stageId}
      position={createPosition(index)}
      level={level}
      style={style.levelStyle}
      hidden={hidden}
    />
  ));
}

function Level({
  level,
  stageId,
  position,
  style,
  hidden,
}: {
  level: GetLevelData;
  stageId: number;
  position: Konva.Vector2d;
  style: CanvasLevelStyle;
  hidden?: boolean;
}) {
  const [editor] = useEditorContext();

  function pushCommand(command: EditorCommand) {
    editor.history.push(command);
    editor.channel.broadcast(command.eventType, command.payload);
  }

  const pushDelete = useBatch<{
    origin: EditorEventOrigin;
    node: CanvasNode;
  }>({
    commit: async (data) => {
      const nodesByUser = new Array<CanvasNode>();
      const nodesToDb = new Array<string>(data.length);
      data.forEach((data, index) => {
        if (data.origin === "user") nodesByUser.push(data.node);
        nodesToDb[index] = data.node.attrs.id;
      });
      if (nodesByUser.length !== 0)
        pushCommand(createDeleteCommand(nodesByUser, level.id, stageId));
      if (nodesToDb.length !== 0) deleteNodes(nodesToDb);
    },
  });

  const pushInsert = useBatch<{
    origin: EditorEventOrigin;
    node: CanvasNode;
  }>({
    commit: async (data) => {
      const nodesByUser = new Array<CanvasNode>();
      const nodesToDb = new Array<CanvasNode>(data.length);
      data.forEach((data, index) => {
        if (data.origin === "user") nodesByUser.push(data.node);
        nodesToDb[index] = data.node;
      });
      if (nodesByUser.length !== 0)
        pushCommand(createCreateCommand(nodesByUser, level.id, stageId));
      if (nodesToDb.length !== 0) upsertNodes(nodesToDb, level.id, stageId);
    },
  });

  const pushUpdate = useBatch<{
    origin: EditorEventOrigin;
    oldNode: CanvasNode;
    newNode: CanvasNode;
  }>({
    commit: async (data) => {
      const nodesByUser = new Array<[old: CanvasNode, new: CanvasNode]>();
      const nodesToDb = new Array<CanvasNode>(data.length);
      data.forEach((data, index) => {
        if (data.origin === "user")
          nodesByUser.push([data.oldNode, data.newNode]);
        nodesToDb[index] = data.newNode;
      });
      if (nodesByUser.length !== 0)
        pushCommand(await createUpdateCommand(nodesByUser));
      // TODO DATA RACE: create RPC that only updates the diffing fields
      if (nodesToDb.length !== 0) upsertNodes(nodesToDb, level.id, stageId);
    },
  });

  return (
    <EditorLevel
      key={level.id}
      id={level.id}
      index={level.index}
      stageId={stageId}
      imageURL={level.image}
      position={position}
      onNodeUpdate={(newNode, oldNode, origin) => {
        if (origin !== "foreign") pushUpdate({ origin, oldNode, newNode });
      }}
      onNodeDelete={(node, origin) => {
        if (origin !== "foreign") pushDelete({ node, origin });
      }}
      onNodeCreate={(node, origin) => {
        if (origin !== "foreign") pushInsert({ node, origin });
      }}
      style={style}
      hidden={hidden}
    />
  );
}
