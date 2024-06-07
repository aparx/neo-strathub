import { FC } from "react";
import { CanvasNode } from "utils/node";
import { v4 as uuidv4 } from "uuid";
import {
  ObjectRendererLookupTable,
  ObjectRendererRenderProps,
} from "./objectRenderer";

type ConfigFromComponent<TComponent> =
  TComponent extends FC<infer TProps extends ObjectRendererRenderProps>
    ? TProps["config"]
    : never;

export function createCanvasNode<
  const TLookupTable extends ObjectRendererLookupTable<any>,
  const TClassName extends keyof TLookupTable,
  const TConfig extends Omit<
    ConfigFromComponent<TLookupTable[TClassName]>,
    "id"
  >,
>(
  renderers: TLookupTable,
  className: TClassName,
  config: TConfig,
  characterId?: number,
): CanvasNode<TConfig & { id: string }> {
  return {
    className: String(className),
    characterId,
    attrs: {
      ...structuredClone(config),
      id: uuidv4(),
    },
  };
}

/**
 * Deeply copies given `node` and reassigns it's identifier to given `newId`.
 *
 * @param node  the node to copy
 * @param newId the new identifier of the node, by default it remains equal
 * @returns the new deeply copied node
 */
export function copyCanvasNode<TNode extends CanvasNode>(
  node: TNode,
  newId: string = node.attrs.id,
): TNode {
  const newNode = structuredClone(node);
  newNode.attrs.id = newId;
  return newNode;
}
