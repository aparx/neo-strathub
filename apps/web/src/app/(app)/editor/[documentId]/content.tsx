"use client";
import * as css from "@/app/(app)/editor/[documentId]/layout.css";
import { BlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import { ArenaLevelData } from "@/modules/game/actions";
import {
  Canvas,
  CanvasLevel,
  createCanvasObject,
  ObjectRenderer,
  primitiveShapes,
} from "@repo/canvas";
import { useCanvas } from "@repo/canvas/src/context/canvasContext";
import { useState } from "react";
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
        movable
        zoomable
        editable
        style={{
          width: windowSize.width,
          height: windowSize.height,
          selectionColor: "rgba(90, 90, 240, .5)",
        }}
      >
        <CanvasLevel
          id={0}
          imageURL="https://svgshare.com/i/161z.svg"
          position={{ x: 0, y: 0 }}
          style={{
            width: 1200,
            height: 800,
            padding: 20,
          }}
        >
          <Renderer />
        </CanvasLevel>
      </Canvas>
    </main>
  );
}

const obj = createCanvasObject(primitiveShapes, "Rect", {
  fill: "red",
  x: 0,
  y: 100,
  width: 50,
  height: 50,
});

function Renderer() {
  const [state, setState] = useState(obj);

  return (
    <ObjectRenderer
      canvas={useCanvas()}
      onSave={setState}
      renderers={primitiveShapes}
    >
      {state}
    </ObjectRenderer>
  );
}
