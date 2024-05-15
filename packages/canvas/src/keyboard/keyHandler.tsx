import { nonNull } from "@repo/utils";
import Konva from "konva";
import { ComponentPropsWithoutRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasRootContext, useCanvas } from "../canvas.context";
import { CanvasNodeData } from "../canvas.data";
import { KeyboardEvent, isPressed } from "./keyMap";

export function CanvasKeyboardHandler(props: ComponentPropsWithoutRef<"div">) {
  const ctx = useCanvas();

  function keyPress(e: KeyboardEvent) {
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
    } else if (isPressed("cut", e)) {
      copyIntoClipboard(ctx);
      deleteSelected(ctx);
    } else if (isPressed("selectAll", e)) {
      selectAll(ctx, e.shiftKey || e.altKey);
    } else if (e.code === "Escape" || e.code === "Enter") {
      ctx.selected.update([]);
      // TODO call undo immediately after for Escape?
    }
  }

  function keyRelease(e: KeyboardEvent) {
    if (ctx.snapping.state && isPressed("snap", e)) ctx.snapping.update(false);
    // Synchronize any moved node (if done)
    const wasMovementKey =
      isPressed("moveLeft", e) ||
      isPressed("moveRight", e) ||
      isPressed("moveTop", e) ||
      isPressed("moveBottom", e);
    if (!wasMovementKey) return;
    // Go through all nodes and check if any was moved
    ctx.data.update((_, dataNodes) =>
      dataNodes.map<CanvasNodeData>((data) => {
        const node = ctx.stage().findOne(`#${data.attrs.id}`)!;
        return node.x() !== data.attrs.x || node.y() !== data.attrs.y
          ? { ...data, attrs: { ...data.attrs, x: node.x(), y: node.y() } }
          : data;
      }),
    );
  }

  return (
    <div
      {...props}
      tabIndex={1}
      onKeyDown={(e) => keyPress(e)}
      onKeyUp={(e) => keyRelease(e)}
    />
  );
}

function selectAll(
  { selected, data, focusedLevel }: CanvasRootContext,
  global: boolean,
) {
  const level = focusedLevel.state && data.getLevel(focusedLevel.state);
  const nodes = global || !level ? data.deepNodes() : level.children.state;
  selected.update(nodes.map((x) => x.attrs.id).filter(nonNull));
}

function copyIntoClipboard({ stage, isSelected }: CanvasRootContext) {
  const targets = stage()
    .find((node: Konva.Node) => isSelected(node.id()))
    .map((node) => node.toObject());
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
    const data = JSON.parse(await blob.text()) as CanvasNodeData[];
    const elements = data.map((node) => {
      node.attrs.id = uuidv4();
      return node;
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
