import { CanvasRootContext } from "canvas.context";
import { CanvasLevelNode, CanvasNodeData } from "canvas.data";
import Konva from "konva";

export interface CopyNodeInput {
  [levelId: number]: Konva.Node[];
}

export function copyNodes(input: CopyNodeInput) {
  const obj = {} as Record<number, CanvasNodeData[]>;
  Object.keys(obj).forEach((stringKey) => {
    const key = Number(stringKey);
    const newData = input[key]?.map((node) => node.toObject());
    obj[key] = (newData ?? []) as CanvasNodeData[];
  });
  putIntoClipboard(obj);
  return obj;
}

export function pasteNodes(level: CanvasLevelNode) {

}

function putIntoClipboard(value: unknown) {
  const type = "text/plain";
  const blob = new Blob([JSON.stringify(value)], { type });
  const item = new ClipboardItem({ [type]: blob });
  navigator.clipboard.write([item]).catch(console.error);
}
