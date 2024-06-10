import { useEditor } from "@/app/(app)/editor/[documentId]/_context";
import { Canvas, CanvasRef, CanvasStyle, primitiveShapes } from "@repo/canvas";
import {
  CanvasContext,
  CanvasContextInteractStatus,
} from "@repo/canvas/src/context/canvasContext";
import { mergeRefs } from "@repo/utils";
import React, { forwardRef, useRef } from "react";
import { DEFAULT_KEY_MAP, EditorKeyboardHandler } from "../features/keyboard";
import { GameObject } from "../objects/gameObject";

export const EDITOR_RENDERERS = {
  ...primitiveShapes,
  GameObject,
} as const;

export interface EditorViewportProps extends CanvasContextInteractStatus {
  style: CanvasStyle;
  children?: React.ReactNode;
}

export const EditorViewport = forwardRef<CanvasContext, EditorViewportProps>(
  function EditorViewport(props, ref) {
    const { style, children, ...restProps } = props;

    const [{ characters, objectCache }] = useEditor();
    const canvasRef = useRef<CanvasRef>(null);

    return (
      <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
        <Canvas
          ref={mergeRefs(canvasRef, ref)}
          style={style}
          functions={{
            getGameObjectURL: (id) => objectCache[id]?.url,
            getCharacterSlot(characterId) {
              const slotData = characters[characterId]?.player_slot;
              if (!slotData) return slotData; // undefined != null
                
              return {
                color: slotData.color,
                self: false /** TODO */,
                objectId: characters[characterId]?.game_object?.id,
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
