import Konva from "konva";
import { ComponentPropsWithoutRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasRootContext, useCanvas } from "../canvas.context";
import { KeyboardEvent, isPressed } from "./keyMap";

export function CanvasKeyboardHandler(props: ComponentPropsWithoutRef<"div">) {
  const ctx = useCanvas();
  return (
    <div
      {...props}
      tabIndex={1}
      onKeyDown={(e) => handleCanvasKeyPress(e, ctx)}
      onKeyUp={(e) => handleCanvasKeyRelease(e, ctx)}
    />
  );
}

function handleCanvasKeyPress(e: KeyboardEvent, ctx: CanvasRootContext) {
  e.preventDefault();
  const moveSpeed = e.shiftKey ? 20 : 5;
  if (isPressed("delete", e)) {
    deleteSelected(ctx);
  } else if (isPressed("duplicate", e)) {
    duplicateSelected(ctx);
  } else if (isPressed("moveLeft", e)) {
    deltaMoveSelected(ctx, -moveSpeed, 0);
  } else if (isPressed("moveRight", e)) {
    deltaMoveSelected(ctx, moveSpeed, 0);
  } else if (isPressed("moveTop", e)) {
    deltaMoveSelected(ctx, 0, -moveSpeed);
  } else if (isPressed("moveBottom", e)) {
    deltaMoveSelected(ctx, 0, moveSpeed);
  } else if (isPressed("snap", e)) {
    ctx.snapping.update(true);
  }
}

function handleCanvasKeyRelease(e: KeyboardEvent, ctx: CanvasRootContext) {
  if (ctx.snapping.state && isPressed("snap", e)) ctx.snapping.update(false);
}

function deleteSelected({ data, selected, isSelected }: CanvasRootContext) {
  data.update((_, old) => old.filter((x) => !x.id || !isSelected(x.id)));
  selected.update((old) => old.filter((x) => !isSelected(x)));
}

function deltaMoveSelected(
  { stage, isSelected }: CanvasRootContext,
  deltaX: number,
  deltaY: number,
) {
  const target = stage();
  target
    .find((x) => isSelected(x.id()))
    .forEach((node) => {
      node.x(node.x() + deltaX);
      node.y(node.y() + deltaY);
    });
  target.batchDraw();
}

function duplicateSelected({ data, selected, isSelected }: CanvasRootContext) {
  const selectIds = new Array<string>(selected.state.length);
  data.update((_, old) => {
    const filtered = old.filter((x) => x.id && isSelected(x.id));
    if (!filtered.length) return old;
    return [
      ...old,
      ...filtered.map((config) => {
        const duplicate = {
          ...config,
          id: uuidv4(),
          x: (config.x ?? 0) + 20,
          y: (config.y ?? 0) + 20,
        } satisfies Konva.NodeConfig;
        selectIds.push(duplicate.id);
        return duplicate;
      }),
    ];
  });
  selected.update(selectIds);
}
