import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { Canvas, CanvasRef, CanvasStyle, primitiveShapes } from "@repo/canvas";
import {
  CanvasContext,
  CanvasContextInteractStatus,
} from "@repo/canvas/context";
import { mergeRefs } from "@repo/utils";
import React, { forwardRef, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DEFAULT_KEY_MAP, EditorKeyboardHandler } from "../features/keyboard";
import { useEditorLocalStorage } from "../hooks";
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

    const [{ characters, objectCache, updateScale, scale }] =
      useEditorContext();
    const canvasRef = useRef<CanvasRef>(null);

    const storage = useEditorLocalStorage();
    const savePos = useDebouncedCallback(storage.position.save, 100);

    useEffect(() => {
      // Sync with position and zoom from local storage
      canvasRef.current?.position.update(
        storage.position.value ?? { x: 0, y: 0 },
      );
    }, [storage.position.value]);

    useEffect(() => canvasRef.current?.scale.update(scale), [scale]);

    return (
      <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
        <Canvas
          ref={mergeRefs(canvasRef, ref)}
          style={style}
          onMove={savePos}
          onZoom={(value) => updateScale(() => value)}
          onGetGameObjectURL={(id) => objectCache[id]?.url}
          onGetCharacterSlot={(characterId) => {
            const slotData = characters[characterId]?.player_slot;
            if (!slotData) return slotData; // undefined != null

            return {
              color: slotData.color,
              self: false /** TODO */,
              objectId: characters[characterId]?.game_object?.id,
            };
          }}
          {...restProps}
        >
          {children}
        </Canvas>
      </EditorKeyboardHandler>
    );
  },
);
