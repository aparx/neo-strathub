"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { ArenaLevelData } from "@/modules/game/actions";
import { Canvas } from "@repo/canvas";
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
      <Canvas
        preferences={{
          width: windowSize.width,
          height: windowSize.height,
        }}
      />
    </main>
  );
}
