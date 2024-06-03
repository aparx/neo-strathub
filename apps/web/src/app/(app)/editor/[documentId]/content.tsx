"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { EditorStage } from "@/modules/editor/components/stage";
import { EditorViewport } from "@/modules/editor/components/viewport";
import { useWindowSize } from "usehooks-ts";

export function EditorContent({
  blueprint,
  stageId,
}: {
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
        <EditorStage
          blueprint={blueprint}
          stageId={stageId}
          position={{ x: 0, y: 0 }}
          style={{
            levelGap: 50,
            levelDirection: [0, 1],
            levelStyle: {
              width: 1200,
              height: 800,
              padding: 20,
            },
          }}
        />
      </EditorViewport>
    </main>
  );
}
