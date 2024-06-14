import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { Canvas, CanvasRef, CanvasStyle, primitiveShapes } from "@repo/canvas";
import {
  CanvasContext,
  CanvasContextInteractStatus,
} from "@repo/canvas/src/context/canvasContext";
import { mergeRefs } from "@repo/utils";
import React, { forwardRef, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useLocalStorage } from "usehooks-ts";
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

    const [{ characters, objectCache }] = useEditorContext();
    const canvasRef = useRef<CanvasRef>(null);

    const [savedPos, setSavedPos] = useLocalStorage("c_pos", { x: 0, y: 0 });
    const [savedZoom, setSavedZoom] = useLocalStorage("c_zoom", 0);

    const savePos = useDebouncedCallback(setSavedPos, 100);
    const saveZoom = useDebouncedCallback(setSavedZoom, 100);

    useEffect(() => {
      // Sync with position and zoom from local storage
      canvasRef.current?.position.update(savedPos ?? { x: 0, y: 0 });
      canvasRef.current?.scale.update(savedZoom || 1);
    }, []);

    return (
      <EditorKeyboardHandler canvas={canvasRef} keyMap={DEFAULT_KEY_MAP}>
        <Canvas
          ref={mergeRefs(canvasRef, ref)}
          style={style}
          onMove={savePos}
          onZoom={saveZoom}
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
