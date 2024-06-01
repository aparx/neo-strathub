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
import { useGetObjects } from "../hooks";

export interface EditorLevelProps extends CanvasLevelData, EditorLevelEvents {
  stageId: number; // TODO move to context?
  style: CanvasLevelStyle;
}

export interface EditorLevelEvents {
  /** Event called when a node is updated and should be applied remotely */
  onNodeUpdate?: <T extends CanvasNode>(newNode: T, oldNode: T) => any;
}

export function EditorLevel({
  id,
  stageId,
  onNodeUpdate,
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

  return (
    <CanvasLevel id={id} {...restProps}>
      {nodes?.map((node, index) => (
        <ObjectRenderer
          key={index /** OK */}
          canvas={canvas}
          renderers={primitiveShapes}
          onUpdate={(configValue) => {
            // TODO determine, whether `node` lies outside the level
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
            onNodeUpdate?.(newNode, node);
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
