import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
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
  const { characters } = useEditor();
  const canvasRef = useRef<CanvasRef>(null);

  return (
    <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
      <Canvas
        ref={canvasRef}
        style={style}
        functions={{
          getCharacterSlot(characterId) {
            const slotData = characters.state[characterId]?.player_slot;
            if (!slotData) return slotData; // undefined != null
            
            return {
              color: slotData.color,
              self: false /** TODO */,
            };
          },
        }}
        {...restProps}
      >
        {children}
      </Canvas>
    </EditorKeyboardHandler>
  );
}
