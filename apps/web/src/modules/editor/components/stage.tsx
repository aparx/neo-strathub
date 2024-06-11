import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle, CanvasNode } from "@repo/canvas";
import type Konva from "konva";
import { useEffect, useMemo } from "react";
import { deleteNodes, upsertNodes } from "../actions";
import {
  CommandHistory,
  EditorCommand,
  createUpdateCommand,
} from "../features/command";
import { createCreateCommand } from "../features/command/commands/createCommand";
import { createDeleteCommand } from "../features/command/commands/deleteCommand";
import { EditorEventOrigin, useEditorEventHandler } from "../features/events";
import { useEditorEvent } from "../features/events/hooks";
import { useSubscribeRealtimeEditor } from "../features/realtime";
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
}

/** An editor stage is rendered within a canvas and represents a stage */
export function EditorStage({
  blueprint,
  stageId,
  style,
  position,
}: EditorStageProps) {
  const eventHandler = useEditorEventHandler();
  const [editor] = useEditor();
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

  const history = useMemo(() => new CommandHistory<EditorCommand>(15), []);

  useEditorEvent("editorUndo", async (e) => {
    if (e.origin !== "user") return;
    const lastCommand = history.moveBack();
    const negatePromise = lastCommand?.negate();
    if (!negatePromise) return;
    const negate = await negatePromise;
    eventHandler.fire(negate.eventType, "history", negate.payload);
    editor.channel.broadcast(negate.eventType, negate.payload);
  });

  useEditorEvent("editorRedo", (e) => {
    if (e.origin !== "user") return;
    const nextCommand = history.moveForward();
    const event = nextCommand?.payload;
    if (!event || !nextCommand) return;
    eventHandler.fire(nextCommand.eventType, "history", event);
    editor.channel.broadcast(nextCommand.eventType, event);
  });

  useSubscribeRealtimeEditor(editor.channel, "*", (payload, type) => {
    console.debug("Received foreign event", type, payload);
    eventHandler.fire(type, "foreign", payload);
  });

  return data?.map((level, index) => (
    <Level
      key={level.id}
      history={history}
      stageId={stageId}
      position={createPosition(index)}
      level={level}
      style={style.levelStyle}
    />
  ));
}

function Level({
  level,
  history,
  stageId,
  position,
  style,
}: {
  level: GetLevelData;
  history: CommandHistory<EditorCommand>;
  stageId: number;
  position: Konva.Vector2d;
  style: CanvasLevelStyle;
}) {
  const [editor] = useEditor();

  function pushCommand(command: EditorCommand) {
    history.push(command);
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
    />
  );
}
