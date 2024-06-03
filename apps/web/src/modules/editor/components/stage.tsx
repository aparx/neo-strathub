import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { CanvasLevelStyle } from "@repo/canvas";
import type Konva from "konva";
import { saveNode } from "../actions";
import { createUpdateCommand } from "../features/actions/editorCommand";
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

  return (
    <>
      {data?.map((level, index) => (
        <EditorLevel
          key={level.id}
          id={level.id}
          stageId={stageId}
          imageURL={level.image}
          position={createPosition(index)}
          onNodeUpdate={(newNode, oldNode) => {
            console.log("create update");
            const command = createUpdateCommand(oldNode, newNode);
            console.log(
              "this",
              command.createEvent(),
              "negate",
              command.negate()?.createEvent(),
            );
            saveNode(newNode);
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
