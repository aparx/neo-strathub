import { CanvasRef } from "@repo/canvas";
import React, { MutableRefObject, useMemo, useRef } from "react";
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
  const eventHandler = useEditorEventHandler();
  const moveTransaction = useRef(false);

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    if (moveTransaction.current) {
      // Commit move event
      eventHandler.fire("elementMove", { deltaX: 0, deltaY: 0 });
      moveTransaction.current = false;
    }
  }

  const checkMove = useCheckElementMove(keyMap, moveTransaction);

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (checkMove(e)) return;
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
) {
  const eventHandler = useEditorEventHandler();
  return useMemo(() => {
    const deltaMatrix = [
      [keyMap.canvas.moveLeft, [-1, 0]],
      [keyMap.canvas.moveRight, [1, 0]],
      [keyMap.canvas.moveUp, [0, -1]],
      [keyMap.canvas.moveDown, [0, 1]],
    ] as const;

    return function _checkElementMove(e: React.KeyboardEvent) {
      const moveKey = deltaMatrix.find(([key]) => isKeyPressed(key, e));
      if (!moveKey) return false;
      const deltaSpeed = e.shiftKey ? 10 : 5;
      moveTransaction.current = moveTransaction.current || e.repeat;
      const [deltaX, deltaY] = moveKey[1];
      eventHandler.fire("elementMove", {
        deltaX: deltaX * deltaSpeed,
        deltaY: deltaY * deltaSpeed,
        transaction: moveTransaction.current,
      });
    };
  }, [keyMap, eventHandler]);
}
