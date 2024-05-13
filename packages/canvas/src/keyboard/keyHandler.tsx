import Konva from "konva";
import { ComponentPropsWithoutRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasContext, useCanvasContext } from "../canvas.context";
import { KeyboardEvent, isPressed } from "./keyMap";

export function CanvasKeyboardHandler(props: ComponentPropsWithoutRef<"div">) {
  const ctx = useCanvasContext();
  return (
    <div
      {...props}
      tabIndex={1}
      onKeyDown={(e) => handleCanvasKeyPress(e, ctx)}
      onKeyUp={(e) => handleCanvasKeyRelease(e, ctx)}
    />
  );
}

function handleCanvasKeyPress(e: KeyboardEvent, ctx: CanvasContext) {
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

function handleCanvasKeyRelease(e: KeyboardEvent, ctx: CanvasContext) {
  if (ctx.snapping.state && isPressed("snap", e)) ctx.snapping.update(false);
}

function deleteSelected({ elements, selected, isSelected }: CanvasContext) {
  elements.update((old) => old.filter((x) => !x.id || !isSelected(x.id)));
  selected.update((old) => old.filter((x) => !isSelected(x)));
}

function deltaMoveSelected(
  { layer, isSelected }: CanvasContext,
  deltaX: number,
  deltaY: number,
) {
  const targetLayer = layer();
  targetLayer.children.forEach((child) => {
    if (!isSelected(child.id())) return;
    child.x(child.x() + deltaX);
    child.y(child.y() + deltaY);
  });
  targetLayer.batchDraw();
}

function duplicateSelected({ elements, selected, isSelected }: CanvasContext) {
  const selectIds = new Array<string>(selected.state.length);
  elements.update((old) => [
    ...old,
    ...old
      .filter((x) => x.id && isSelected(x.id))
      .map((config) => {
        const duplicate = {
          ...config,
          id: uuidv4(),
          x: (config.x ?? 0) + 20,
          y: (config.y ?? 0) + 20,
        } satisfies Konva.NodeConfig;
        selectIds.push(duplicate.id);
        return duplicate;
      }),
  ]);
  selected.update(selectIds);
}
