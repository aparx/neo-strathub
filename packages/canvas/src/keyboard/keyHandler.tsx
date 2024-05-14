import { nonNull } from "@repo/utils";
import Konva from "konva";
import { ComponentPropsWithoutRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasRootContext, useCanvas } from "../canvas.context";
import { CanvasNodeData } from "../canvas.data";
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
  } else if (isPressed("copy", e)) {
    copyIntoClipboard(ctx);
  } else if (isPressed("paste", e)) {
    pasteClipboard(ctx);
  } else if (isPressed("selectAll", e)) {
    selectAll(ctx);
  } else if (e.code === "Escape" || e.code === "Enter") {
    ctx.selected.update([]);
    // TODO call undo immediately after for Escape?
  }
}

function handleCanvasKeyRelease(e: KeyboardEvent, ctx: CanvasRootContext) {
  if (ctx.snapping.state && isPressed("snap", e)) ctx.snapping.update(false);
}

// prettier-ignore
function selectAll({ selected, data }: CanvasRootContext) {
  selected.update(data.deepNodes().map((x) => x.attrs.id).filter(nonNull));
}

function copyIntoClipboard({ stage, isSelected }: CanvasRootContext) {
  const targets = stage()
    .find((node: Konva.Node) => isSelected(node.id()))
    .map((node) => node.toJSON());
  if (!targets.length) return;
  const type = "text/plain";
  const blob = new Blob([JSON.stringify(targets)], { type });
  const item = new ClipboardItem({ [type]: blob });
  navigator.clipboard.write([item]).catch(console.error);
}

function pasteClipboard({ data, selected, focusedLevel }: CanvasRootContext) {
  const level = focusedLevel.state && data.getLevel(focusedLevel.state);
  if (!level) return;
  navigator.clipboard.read().then(async (items) => {
    const item = items[0];
    if (!item) return;
    const blob = await item.getType("text/plain");
    const data = JSON.parse(await blob.text()) as string[];
    const elements = data.map((x) => {
      const config: CanvasNodeData = JSON.parse(x);
      config.attrs.id = uuidv4();
      return config;
    });
    level.children.update((prev) => [...prev, ...elements]);
    selected.update(elements.map((x) => x.attrs.id).filter(nonNull));
  });
  return;
}

function deleteSelected({ data, selected, isSelected }: CanvasRootContext) {
  data.update((_, old) =>
    old.filter((x) => !x.attrs.id || !isSelected(x.attrs.id)),
  );
  selected.update((old) => old.filter((x) => !isSelected(x)));
}

function deltaMoveSelected(
  { stage, isSelected }: CanvasRootContext,
  deltaX: number,
  deltaY: number,
) {
  const target = stage();
  target
    .find((x: Konva.Node) => isSelected(x.id()))
    .forEach((node) => {
      node.x(node.x() + deltaX);
      node.y(node.y() + deltaY);
    });
  target.batchDraw();
}

function duplicateSelected({ data, selected, isSelected }: CanvasRootContext) {
  const selectIds = new Array<string>(selected.state.length);
  data.update((_, old) => {
    const filtered = old.filter((x) => x.attrs.id && isSelected(x.attrs.id));
    if (!filtered.length) return old;
    return [
      ...old,
      ...filtered.map((node) => {
        const duplicate = {
          ...node,
          attrs: {
            ...node.attrs,
            id: uuidv4(),
            x: (node.attrs.x ?? 0) + 20,
            y: (node.attrs.y ?? 0) + 20,
          },
        } satisfies CanvasNodeData;
        selectIds.push(duplicate.attrs.id);
        return duplicate;
      }),
    ];
  });
  selected.update(selectIds);
}
