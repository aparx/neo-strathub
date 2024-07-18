import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { CanvasNode, CanvasRef } from "@repo/canvas";
import { CanvasContext } from "@repo/canvas/context";
import React, { MutableRefObject, RefObject, useMemo, useRef } from "react";
import { useEditorEventHandler } from "../events";
import { EditorKeyMapTree, isKeyPressed } from "./editorKeyMap";

export interface KeyboardHandlerProps {
  children: React.ReactNode;
  keyMap: EditorKeyMapTree;
  canvas: React.RefObject<CanvasRef>;
}

export function EditorKeyboardHandler({
  children,
  keyMap,
  canvas,
}: KeyboardHandlerProps) {
  const [editor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const moveTransaction = useRef(false);

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    const event = eventHandler.fire("keyRelease", "user", { ...e, keyMap });
    if (event.defaultPrevented) return;

    if (moveTransaction.current) {
      // Commit move event
      eventHandler.fire("canvasMove", "user", {
        targets: canvas.current?.selected.state ?? [],
        deltaX: 0,
        deltaY: 0,
      });
      moveTransaction.current = false;
    }
  }

  const checkMove = useCheckElementMove(keyMap, moveTransaction, canvas);

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    e.preventDefault();

    // Forward key press to subscribers
    const event = eventHandler.fire("keyPress", "user", { ...e, keyMap });
    if (event.defaultPrevented) return;

    // Handle default behaviours of key press
    if (checkMove(e)) return;
    if (isKeyPressed(keyMap.canvas.delete, e)) {
      eventHandler.fire("canvasDelete", "user", {
        targets: canvas.current?.selected.state ?? [],
      });
    } else if (isKeyPressed(keyMap.canvas.duplicate, e)) {
      const targets = canvas.current?.selected.state ?? [];
      canvas.current?.selected.update([]); // Clear selection
      eventHandler.fire("canvasDuplicate", "user", { targets });
    } else if (isKeyPressed(keyMap.editor.undo, e)) {
      eventHandler.fire("editorUndo", "user", {});
    } else if (isKeyPressed(keyMap.editor.redo, e)) {
      eventHandler.fire("editorRedo", "user", {});
    } else if (isKeyPressed(keyMap.editor.close, e)) {
      canvas.current?.selected.update([]);
    }
  }

  return (
    <div
      tabIndex={1}
      onKeyDown={keyDown}
      onKeyUp={keyUp}
      onClick={(e) => e.currentTarget.focus()}
    >
      {children}
    </div>
  );
}

/**
 * Returns a function that can be used to fire an `elementMove` event, when
 * a given keyboard event is suggesting such an event to be fired.
 *
 *
 * @param keyMap          the key map used to determine, whether a move key
 *                        was pressed (and what direction)
 * @param moveTransaction a transaction ref, used to determine whether to
 *                        immediately commit a movement change (useful to save
 *                        outgoing bandwidth) to the database
 */
function useCheckElementMove(
  keyMap: EditorKeyMapTree,
  moveTransaction: MutableRefObject<boolean>,
  canvas: RefObject<CanvasContext | null>,
) {
  const eventHandler = useEditorEventHandler();
  return useMemo(() => {
    const deltaMatrix = [
      [keyMap.canvas.moveLeft, [-1, 0]],
      [keyMap.canvas.moveRight, [1, 0]],
      [keyMap.canvas.moveUp, [0, -1]],
      [keyMap.canvas.moveDown, [0, 1]],
    ] as const;

    return (e: React.KeyboardEvent) => {
      const moveKey = deltaMatrix.find(([key]) => isKeyPressed(key, e));
      if (!moveKey) return false;
      const deltaSpeed = e.shiftKey ? 10 : 5;
      moveTransaction.current = moveTransaction.current || e.repeat;
      const [deltaX, deltaY] = moveKey[1];
      eventHandler.fire("canvasMove", "user", {
        targets: canvas.current?.selected.state ?? [],
        deltaX: deltaX * deltaSpeed,
        deltaY: deltaY * deltaSpeed,
        transaction: moveTransaction.current,
      });
    };
  }, [keyMap, eventHandler, canvas]);
}

type ClipboardData = {
  arenaId: number;
  nodes: Array<CanvasNode & { layerId: any }>;
};
