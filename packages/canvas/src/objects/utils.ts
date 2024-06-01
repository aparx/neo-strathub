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

export function createCanvasObject<
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
): CanvasNode<TConfig & { id: string }> {
  return {
    className: String(className),
    attrs: {
      ...config,
      id: uuidv4(),
    },
  };
}
