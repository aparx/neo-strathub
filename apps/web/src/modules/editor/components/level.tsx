import {
  CanvasLevel,
  CanvasLevelData,
  CanvasLevelStyle,
  CanvasNode,
  CanvasNodeConfig,
  ObjectRenderer,
  primitiveShapes,
} from "@repo/canvas";
import { useCanvas } from "@repo/canvas/src/context/canvasContext";
import { useEffect, useState } from "react";
import { useEditorEvent } from "../features/events/hooks";
import { useGetObjects } from "../hooks";

export interface EditorLevelProps extends CanvasLevelData, EditorLevelEvents {
  stageId: number; // TODO move to context?
  style: CanvasLevelStyle;
}

export interface EditorLevelEvents {
  /** Event called when a node is updated and should be applied remotely */
  onNodeUpdate: <T extends CanvasNode>(newNode: T, oldNode: T) => any;
  onNodeDelete: (node: CanvasNode) => any;
}

export function EditorLevel({
  id,
  stageId,
  onNodeUpdate,
  onNodeDelete,
  ...restProps
}: EditorLevelProps) {
  const canvas = useCanvas();
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const { data } = useGetObjects(stageId, id);
  useEffect(() => {
    if (!data) return setNodes([]);
    setNodes(
      data?.map((object) => ({
        className: object.classname,
        attrs: {
          ...(object.attributes as CanvasNodeConfig),
          characterId: object.character_id,
          id: object.id,
        },
      })),
    );
  }, [data]);

  // TODO hook into canvas events, such as "move", "duplicate", etc.
  useEditorEvent("canvasMove", (e) => {
    const { deltaX, deltaY } = e.event;
    const targets = e.event.targets;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (!targets.includes(node.attrs.id)) return node;
        const newNode = { ...node, attrs: { ...node.attrs } };
        newNode.attrs.x = (node.attrs.x ?? 0) + deltaX;
        newNode.attrs.y = (node.attrs.y ?? 0) + deltaY;
        if (!e.event.transaction) onNodeUpdate(newNode, node);
        return newNode;
      }),
    );
  });

  useEditorEvent("canvasDelete", (e) => {
    const targets = e.event.targets;
    setNodes((nodes) => {
      const newArray = new Array<CanvasNode>(nodes.length);
      let insertionIndex = 0;
      nodes.forEach((node) => {
        if (targets.includes(node.attrs.id)) onNodeDelete(node);
        else newArray[insertionIndex++] = node;
      });
      const overflow = newArray.length - insertionIndex;
      if (overflow > 0) newArray.splice(insertionIndex, overflow);
      return newArray;
    });
  });

  return (
    <CanvasLevel id={id} {...restProps}>
      {nodes?.map((node, index) => (
        <ObjectRenderer
          key={index /** OK */}
          canvas={canvas}
          renderers={primitiveShapes}
          onUpdate={(configValue) => {
            // TODO delete the node if it lies outside the level
            const oldNodes = nodes;
            const newNodes = [...oldNodes];
            const oldConfig = newNodes[index]?.attrs;
            const newConfig =
              typeof configValue === "function"
                ? configValue(oldConfig)
                : configValue;
            const newNode = {
              ...node,
              attrs: newConfig,
            };
            onNodeUpdate(newNode, node);
            newNodes[index] = newNode;
            setNodes(newNodes);
          }}
        >
          {node}
        </ObjectRenderer>
      ))}
    </CanvasLevel>
  );
}
