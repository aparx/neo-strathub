import { Canvas, CanvasRef, CanvasStyle } from "@repo/canvas";
import { CanvasUserModifyStatus } from "@repo/canvas/src/context/canvasContext";
import React, { useRef } from "react";
import { DEFAULT_KEY_MAP, EditorKeyboardHandler } from "../features/keyboard";

export interface EditorViewportProps extends CanvasUserModifyStatus {
  style: CanvasStyle;
  children?: React.ReactNode;
}

export function EditorViewport({
  style,
  children,
  ...restProps
}: EditorViewportProps) {
  const canvasRef = useRef<CanvasRef>(null);

  return (
    <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
      <Canvas ref={canvasRef} style={style} {...restProps}>
        {children}
      </Canvas>
    </EditorKeyboardHandler>
  );
}
