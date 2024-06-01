"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { EditorStage } from "@/modules/editor/components/stage";
import { EditorViewport } from "@/modules/editor/components/viewport";
import { ArenaLevelData } from "@/modules/game/actions";
import { useWindowSize } from "usehooks-ts";

export function EditorContent({
  levels,
  blueprint,
  stageId,
}: {
  levels: ArenaLevelData[];
  blueprint: BlueprintData;
  stageId: number;
}) {
  // https://svgshare.com/i/161z.svg
  // https://svgshare.com/i/162B.svg
  // https://svgshare.com/i/1602.svg

  const windowSize = useWindowSize();

  return (
    <main>
      <div className={css.fadeInRect} />
      <EditorViewport
        zoomable
        editable
        movable
        style={{
          width: windowSize.width,
          height: windowSize.height,
          selectionColor: "rgba(90, 90, 240, .5)",
        }}
      >
        <EditorStage blueprint={blueprint} stageId={stageId} />
      </EditorViewport>
    </main>
  );
}
