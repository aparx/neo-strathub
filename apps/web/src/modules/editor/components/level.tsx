import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import {
  CanvasLevel,
  CanvasLevelData,
  CanvasLevelStyle,
  CanvasNode,
  CanvasNodeConfig,
  copyCanvasNode,
  ObjectRenderer,
} from "@repo/canvas";
import { useCanvas } from "@repo/canvas/src/context/canvasContext";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  EditorCreateEvent,
  EditorEventObject,
  EditorEventOrigin,
} from "../features/events";
import { useEditorEvent } from "../features/events/hooks";
import { useGetObjects } from "../hooks";
import { EDITOR_RENDERERS } from "./viewport";

export interface EditorLevelProps extends CanvasLevelData, EditorLevelEvents {
  stageId: number; // TODO move to context?
  style: CanvasLevelStyle;
}

export interface EditorLevelEvents {
  /** Event called when a node is updated and should be applied remotely */
  onNodeUpdate: <T extends CanvasNode>(
    newNode: T,
    oldNode: T,
    origin: EditorEventOrigin,
  ) => any;
  onNodeDelete: (node: CanvasNode, origin: EditorEventOrigin) => any;
  onNodeCreate: (node: CanvasNode, origin: EditorEventOrigin) => any;
}

export function EditorLevel({
  id,
  stageId,
  onNodeUpdate,
  onNodeDelete,
  onNodeCreate,
  style,
  ...restProps
}: EditorLevelProps) {
  const canvas = useCanvas();
  const [editor, updateEditor] = useEditor();
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const { data } = useGetObjects(stageId, id);
  useEffect(() => {
    if (!data) return setNodes([]);
    setNodes(
      data?.map((object) => ({
        className: object.classname,
        characterId: object.character_id,
        attrs: {
          ...(object.attributes as Omit<CanvasNodeConfig, "id">),
          id: object.id,
        },
      })),
    );
  }, [data]);

  useMoveEvent({ onNodeUpdate, setNodes });

  useDeleteEvent({ onNodeDelete, setNodes });

  useDuplicateEvent({ onNodeCreate, setNodes });

  useUpdateEvent({ onNodeUpdate, setNodes });

  useCreateEvent({ onNodeCreate, setNodes, levelId: id, stageId });

  return (
    <CanvasLevel
      id={id}
      style={style}
      {...restProps}
      onMouseEnter={() => updateEditor((o) => ({ ...o, focusedLevel: id }))}
      strokeEnabled={editor.focusedLevel === id}
      stroke={style.focusStroke}
      strokeWidth={3}
      strokeScaleEnabled={false}
    >
      {nodes?.map((node, index) => (
        <ObjectRenderer
          key={index /** OK */}
          canvas={canvas}
          renderers={EDITOR_RENDERERS}
          onUpdate={(configValue) => {
            // TODO delete the node if it lies outside the level
            const oldNodes = nodes;
            const newNodes = [...oldNodes];
            const oldConfig = newNodes[index]!.attrs;
            const newConfig =
              typeof configValue === "function"
                ? configValue(oldConfig as any)
                : configValue;
            const newNode = { ...node, attrs: newConfig };
            onNodeUpdate(newNode, node, "user");
            newNodes[index] = newNode;
            setNodes(newNodes);
          }}
        >
          {node as CanvasNode<any>}
        </ObjectRenderer>
      ))}
    </CanvasLevel>
  );
}

function useMoveEvent<T extends CanvasNode>({
  onNodeUpdate,
  setNodes,
}: {
  onNodeUpdate: EditorLevelEvents["onNodeUpdate"];
  setNodes: Dispatch<SetStateAction<T[]>>;
}) {
  // Array of nodes to diff against on move transaction completion
  const moveStartRef = useRef<CanvasNode[]>();

  // Allow for movement of level elements
  useEditorEvent("canvasMove", (e) => {
    const { deltaX, deltaY, transaction } = e.event;
    const targets = e.event.targets;
    setNodes((nodes) => {
      if (e.defaultPrevented) return nodes;
      if (!moveStartRef.current && transaction) moveStartRef.current = nodes;
      const newNodes = nodes.map((node, index) => {
        if (!targets.includes(node.attrs.id)) return node;
        const newNode = copyCanvasNode(node);
        newNode.attrs.x = (node.attrs.x ?? 0) + deltaX;
        newNode.attrs.y = (node.attrs.y ?? 0) + deltaY;
        const oldNode = moveStartRef.current?.[index] || node;
        if (!transaction) onNodeUpdate(newNode, oldNode, e.origin);
        return newNode;
      });
      if (!transaction) moveStartRef.current = undefined;
      return newNodes;
    });
  });
}

function useDeleteEvent<T extends CanvasNode>({
  onNodeDelete,
  setNodes,
}: {
  onNodeDelete: EditorLevelEvents["onNodeDelete"];
  setNodes: Dispatch<SetStateAction<T[]>>;
}) {
  const ctx = useCanvas();

  // Allow for deletion of level elements
  useEditorEvent("canvasDelete", (e) => {
    const targets = e.event.targets;
    ctx.selected.update((ids) => ids.filter((x) => !targets.includes(x)));

    setNodes((nodes) => {
      if (e.defaultPrevented) return nodes;
      const newArray = new Array<T>(nodes.length);
      let index = 0;
      nodes.forEach((node) => {
        if (!targets.includes(node.attrs.id)) {
          newArray[index++] = node;
        } else {
          onNodeDelete(node, e.origin);
        }
      });
      const overflow = newArray.length - index;
      if (overflow > 0) newArray.splice(index, overflow);
      return newArray;
    });
  });
}

function useDuplicateEvent<T extends CanvasNode>({
  onNodeCreate,
  setNodes,
}: {
  onNodeCreate: EditorLevelEvents["onNodeCreate"];
  setNodes: Dispatch<SetStateAction<T[]>>;
}) {
  const { selected } = useCanvas();

  // Allow for element duplication
  useEditorEvent("canvasDuplicate", (e) => {
    const targets = e.event.targets;
    setNodes((nodes) => {
      if (e.defaultPrevented) return nodes;
      const newArray = new Array<T>(nodes.length + targets.length);
      let index = 0;
      const copied = new Array<string>();
      nodes.forEach((node) => {
        newArray[index++] = node;
        if (!targets.includes(node.attrs.id)) return;
        const nodeCopy = copyCanvasNode(node, uuidv4());
        nodeCopy.attrs.x = (nodeCopy.attrs.x ?? 0) + 10;
        nodeCopy.attrs.y = (nodeCopy.attrs.y ?? 0) + 10;
        onNodeCreate((newArray[index++] = nodeCopy), e.origin);
        copied.push(nodeCopy.attrs.id);
      });
      selected.update((prev) => [...prev, ...copied]);
      const overflow = newArray.length - index;
      if (overflow > 0) newArray.splice(index, overflow);
      return newArray;
    });
  });
}

function useUpdateEvent<T extends CanvasNode>({
  onNodeUpdate,
  setNodes,
}: {
  onNodeUpdate: EditorLevelEvents["onNodeUpdate"];
  setNodes: Dispatch<SetStateAction<T[]>>;
}) {
  useEditorEvent("canvasUpdate", (e) => {
    setNodes((nodes) => {
      if (e.defaultPrevented) return nodes;
      return nodes.map((node) => {
        const fields = e.event.fields[node.attrs.id];
        if (!fields) return node;
        const newNode = copyCanvasNode(node);
        const fieldsCopy = structuredClone(fields);
        Object.keys(fields).forEach((key) => {
          newNode.attrs[key as any] = fieldsCopy[key];
        });
        onNodeUpdate(newNode, node, e.origin);
        return newNode;
      });
    });
  });
}

function useCreateEvent<T extends CanvasNode>({
  onNodeCreate,
  setNodes,
  levelId,
  stageId,
}: {
  onNodeCreate: EditorLevelEvents["onNodeCreate"];
  setNodes: Dispatch<SetStateAction<T[]>>;
  levelId: number;
  stageId: number;
}) {
  function handle(e: EditorEventObject<EditorCreateEvent>) {
    if (e.event.levelId !== levelId || e.event.stageId !== stageId) return;
    setNodes((oldNodes) => [...oldNodes, ...(e.event.nodes as T[])]);
    e.event.nodes.forEach((node) => onNodeCreate(node, e.origin));
  }

  useEditorEvent("canvasCreate", handle);
  useEditorEvent("canvasDrop", handle);
}
