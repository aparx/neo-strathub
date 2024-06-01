import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { saveNode } from "../actions";
import { useGetLevels } from "../hooks";
import { EditorLevel } from "./level";

export interface EditorStageProps {
  blueprint: BlueprintData;
  stageId: number;
}

/** An editor stage is rendered within a canvas and represents a stage */
export function EditorStage({ blueprint, stageId }: EditorStageProps) {
  const { data } = useGetLevels(blueprint.arena.id);

  // TODO change history for UNDO & REDO

  return (
    <>
      {data?.map((level) => (
        <EditorLevel
          key={level.id}
          id={level.id}
          stageId={stageId}
          imageURL={level.image}
          position={{ x: 0, y: 0 }}
          onNodeUpdate={(newNode) => saveNode(newNode)}
          style={{
            width: 1200,
            height: 800,
            padding: 20,
          }}
        />
      ))}
    </>
  );
}
