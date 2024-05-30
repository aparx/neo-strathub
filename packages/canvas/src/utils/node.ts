import { Nullish } from "@repo/utils";
import Konva from "konva";

/**
 * Interface representing fields present for any node that can be serialized,
 * deserialized and rendered on the canvas.
 */
export interface CanvasNode<
  TConfig extends Konva.NodeConfig = Konva.NodeConfig,
> {
  attrs: TConfig;
  className: string;
}

/**
 * Interface representing a node configuration, that adds the ability to assign
 * a blueprint's character to itself.
 */
export interface CanvasCharacterConfig extends Konva.NodeConfig {
  characterId?: Nullish | string;
}
