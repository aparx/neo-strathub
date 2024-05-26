import { FC, ForwardRefExoticComponent } from "react";
import { v4 as uuidv4 } from "uuid";
import { CanvasNodeConfig, CanvasNodeData } from "../canvas.data";
import { CanvasObjectProps } from "./canvasObjectRenderer";

export type CanvasShapeRenderer<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
  TExtraProps = {},
> = ForwardRefExoticComponent<CanvasObjectProps<TConfig> & TExtraProps>;

export interface CanvasRendererLookupTable<T extends CanvasNodeConfig = any> {
  [key: string]: CanvasShapeRenderer<T>;
}

type ConfigFromProps<T> =
  T extends CanvasObjectProps<infer TConfig> ? TConfig : never;

type ConfigFromComponentFn<T> =
  T extends ForwardRefExoticComponent<infer TProps>
    ? ConfigFromProps<TProps>
    : T extends FC<infer TProps>
      ? ConfigFromProps<TProps>
      : never;

export type CanvasNodeConfigFromClassName<
  TLookupTable extends CanvasRendererLookupTable,
  TClassName extends keyof TLookupTable,
> = ConfigFromComponentFn<TLookupTable[TClassName]>;

/**
 * Returns shape data, used to create new canvas objects, based on the current
 * `className` and `config`. This is the most typesafe way. Also, if not provided, an
 * identifier is automatically generated.
 */
export function createShapeData<
  const TLookupTable extends CanvasRendererLookupTable,
  const TClassName extends keyof TLookupTable,
>(
  table: TLookupTable,
  className: TClassName,
  config: CanvasNodeConfigFromClassName<TLookupTable, TClassName>,
): CanvasNodeData<CanvasNodeConfigFromClassName<TLookupTable, TClassName>> {
  return {
    attrs: {
      id: ("id" in config && config.id) || uuidv4(),
      ...config,
    },
    className: className as string,
  };
}

export function isShapeIdSupported<
  const TLookupTable extends CanvasRendererLookupTable,
>(table: TLookupTable, key: any): key is keyof TLookupTable {
  return typeof key === "string" && key in table && table[key] != null;
}
