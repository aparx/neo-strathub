import { CanvasRef } from "@repo/canvas";
import { CanvasContext } from "@repo/canvas/context";
import React, { MutableRefObject, RefObject, useMemo, useRef } from "react";
import { useEditorEventHandler } from "../events";
import { EditorKeyMap, isKeyPressed } from "./editorKeyMap";

export interface KeyboardHandlerProps {
  children: React.ReactNode;
  keyMap: EditorKeyMap;
  canvas: React.RefObject<CanvasRef>;
}

export function EditorKeyboardHandler({
  children,
  keyMap,
  canvas,
}: KeyboardHandlerProps) {
  const eventHandler = useEditorEventHandler();
  const moveTransaction = useRef(false);

  const checkMove = useCheckElementMove(keyMap, moveTransaction, canvas);

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    const keysReleased = keyMap.collectMatches(e);
    if (!keysReleased.length) return;
    eventHandler.fire("keyRelease", "user", {
      event: e,
      keyMap,
      keys: keysReleased,
    });
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

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    e.preventDefault();

    const keysPressed = keyMap.collectMatches(e);
    keyMap.forEachMatching(e, function () {
      console.log("matching", this);
    });

    if (!keysPressed.length) return;

    // Forward key press to subscribers
    const event = eventHandler.fire("keyPress", "user", {
      event: e,
      keyMap,
      keys: keysPressed,
    });
    if (event.defaultPrevented) return;

    // Handle default behaviours of key press
    if (checkMove(e)) return;
    keysPressed.find((key) => {
      switch (key) {
        case "delete":
          eventHandler.fire("canvasDelete", "user", {
            targets: canvas.current?.selected.state ?? [],
          });
          return true;
        case "duplicate":
          const targets = canvas.current?.selected.state ?? [];
          canvas.current?.selected.update([]); // Clear selection
          eventHandler.fire("canvasDuplicate", "user", { targets });
          return true;
        case "undo":
          eventHandler.fire("editorUndo", "user", {});
          return true;
        case "redo":
          eventHandler.fire("editorRedo", "user", {});
          return true;
        case "close":
          canvas.current?.selected.update([]);
          return true;
        default:
          return false;
      }
    });
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
  keyMap: EditorKeyMap,
  moveTransaction: MutableRefObject<boolean>,
  canvas: RefObject<CanvasContext | null>,
) {
  const eventHandler = useEditorEventHandler();
  return useMemo(() => {
    const deltaMatrix = [
      [keyMap.tree.moveLeft, [-1, 0]],
      [keyMap.tree.moveRight, [1, 0]],
      [keyMap.tree.moveUp, [0, -1]],
      [keyMap.tree.moveDown, [0, 1]],
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
