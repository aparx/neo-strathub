import Konva from "konva";
import { NodeTags } from "./types";

/** Returns the level layer at given absolute position (`cursor`)  */
export function getLevelLayerAtCursor(
  stage: Konva.Stage,
  cursorX: number,
  cursorY: number,
): Konva.Layer | undefined {
  return stage.children.find((layer) => {
    if (!layer.hasName(NodeTags.LEVEL_LAYER)) return false;
    const rect = layer.getClientRect();
    return (
      cursorX >= rect.x &&
      cursorX < rect.x + rect.width &&
      cursorY >= rect.y &&
      cursorY < rect.y + rect.height
    );
  });
}
