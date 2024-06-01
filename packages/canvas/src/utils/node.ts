import { Nullish } from "@repo/utils";
import Konva from "konva";

/**
 * Interface representing fields present for any node that can be serialized,
 * deserialized and rendered on the canvas.
 */
export interface CanvasNode<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  attrs: TConfig;
  className: string;
}

export interface CanvasNodeConfig extends Konva.NodeConfig {
  /** Represents the ID column in `blueprint_object` */
  id: string;
}

/**
 * Interface representing a node configuration, that adds the ability to assign
 * a blueprint's character to itself.
 */
export interface CanvasNodeCharacterConfig extends CanvasNodeConfig {
  characterId?: Nullish | string;
}

export type InferNodeConfig<TNode> =
  TNode extends CanvasNode<infer TConfig> ? TConfig : never;