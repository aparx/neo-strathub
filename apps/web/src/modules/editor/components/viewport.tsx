import { Canvas, CanvasRef, CanvasStyle } from "@repo/canvas";
import { CanvasContextInteractStatus } from "@repo/canvas/src/context/canvasContext";
import React, { useRef } from "react";
import { DEFAULT_KEY_MAP, EditorKeyboardHandler } from "../features/keyboard";

export interface EditorViewportProps extends CanvasContextInteractStatus {
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
      <Canvas
        ref={canvasRef}
        style={style}
        functions={{
          getCharacterSlot(characterId) {
            return null;
          },
        }}
        {...restProps}
      >
        {children}
      </Canvas>
    </EditorKeyboardHandler>
  );
}
