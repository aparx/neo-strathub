"use client";
import { EditorStage } from "@/modules/editor/components/stage";
import { EditorViewport } from "@/modules/editor/components/viewport";
import { useEffect } from "react";
import { useWindowSize } from "usehooks-ts";
import { useEditor } from "../_context";
import { EditorConfig } from "../_utils";

export function EditorPreviewWindow({ stageIds }: { stageIds: number[] }) {
  const windowSize = useWindowSize();
  const [editor, updateEditor] = useEditor();

  const style = EditorConfig.STAGE_STYLE;

  useEffect(() => {
    updateEditor((old) => ({
      ...old,
      editable: false,
      selectable: false,
    }));
  }, []);

  return (
    <main>
      <EditorViewport
        zoomable={editor.zoomable}
        movable={editor.movable}
        style={{
          width: windowSize.width,
          height: windowSize.height,
          selectionColor: `rgba(${EditorConfig.FOCUS_COLOR.join(", ")}, .5)`,
        }}
      >
        {stageIds.map((stageId, index) => (
          <EditorStage
            blueprint={editor.blueprint}
            stageId={stageId}
            position={{
              x: index * (style.levelStyle.width + 2 * style.levelGap),
              y: 0,
            }}
            style={EditorConfig.STAGE_STYLE}
          />
        ))}
      </EditorViewport>
    </main>
  );
}
