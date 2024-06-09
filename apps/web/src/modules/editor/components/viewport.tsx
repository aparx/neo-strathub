import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import { Canvas, CanvasRef, CanvasStyle, primitiveShapes } from "@repo/canvas";
import {
  CanvasContext,
  CanvasContextInteractStatus,
} from "@repo/canvas/src/context/canvasContext";
import { mergeRefs } from "@repo/utils";
import React, { forwardRef, useRef } from "react";
import { DEFAULT_KEY_MAP, EditorKeyboardHandler } from "../features/keyboard";

export const EDITOR_RENDERERS = primitiveShapes;

export interface EditorViewportProps extends CanvasContextInteractStatus {
  style: CanvasStyle;
  children?: React.ReactNode;
}

export const EditorViewport = forwardRef<CanvasContext, EditorViewportProps>(
  function EditorViewport(props, ref) {
    const { style, children, ...restProps } = props;

    const { characters } = useEditor();
    const canvasRef = useRef<CanvasRef>(null);

    return (
      <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
        <Canvas
          ref={mergeRefs(canvasRef, ref)}
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
  },
);
