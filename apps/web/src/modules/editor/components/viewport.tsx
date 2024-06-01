import { Canvas, CanvasStyle } from "@repo/canvas";
import { CanvasUserModifyStatus } from "@repo/canvas/src/context/canvasContext";
import React from "react";

export interface EditorViewportProps extends CanvasUserModifyStatus {
  style: CanvasStyle;
  children?: React.ReactNode;
}

export function EditorViewport({
  style,
  children,
  ...restProps
}: EditorViewportProps) {
  return (
    <div
      tabIndex={1}
      onKeyDown={() => console.log("TAP")}
      onClick={(e) => e.currentTarget.focus()}
    >
      <Canvas style={style} {...restProps}>
        {children}
      </Canvas>
    </div>
  );
}
