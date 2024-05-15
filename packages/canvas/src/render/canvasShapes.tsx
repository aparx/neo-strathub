import Konva from "konva";
import { forwardRef, ForwardRefExoticComponent } from "react";
import * as ReactKonva from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { CanvasNodeConfig, CanvasNodeData } from "../canvas.data";
import { CanvasObjectProps } from "./canvasObjectRenderer";

export const Rect = forwardRef<
  Konva.Rect,
  CanvasObjectProps<CanvasNodeConfig<Konva.RectConfig>>
>(({ data, modifiable, ...restProps }, ref) => (
  <ReactKonva.Rect
    ref={ref}
    draggable={modifiable}
    {...data.attrs}
    {...restProps}
  />
));

export const Circle = forwardRef<
  Konva.Circle,
  CanvasObjectProps<CanvasNodeConfig<Konva.CircleConfig>>
>(({ data, modifiable, ...restProps }, ref) => (
  <ReactKonva.Circle
    ref={ref}
    draggable={modifiable}
    {...data.attrs}
    {...restProps}
  />
));

export const Arrow = forwardRef<
  Konva.Arrow,
  CanvasObjectProps<CanvasNodeConfig<Konva.ArrowConfig>>
>(({ data, modifiable, ...restProps }, ref) => (
  <ReactKonva.Arrow
    ref={ref}
    draggable={modifiable}
    {...data.attrs}
    {...restProps}
  />
));

export const Line = forwardRef<
  Konva.Line,
  CanvasObjectProps<CanvasNodeConfig<Konva.LineConfig>>
>(({ data, modifiable, ...restProps }, ref) => (
  <ReactKonva.Line
    ref={ref}
    draggable={modifiable}
    {...data.attrs}
    {...restProps}
  />
));

export const CANVAS_SHAPES = {
  Rect,
  Circle,
  Arrow,
  Line,
} as const;

type PrimitiveShapeKey = keyof typeof CANVAS_SHAPES;
type ConfigFromProps<T extends CanvasObjectProps> =
  T extends CanvasObjectProps<infer TConfig> ? TConfig : never;
type ConfigFromFn<T> =
  T extends ForwardRefExoticComponent<
    infer TProps extends CanvasObjectProps<any>
  >
    ? ConfigFromProps<TProps>
    : never;
type ConfigFromClassName<T extends PrimitiveShapeKey> = ConfigFromFn<
  (typeof CANVAS_SHAPES)[T]
>;

export function createShapeData<const TClassName extends PrimitiveShapeKey>(
  className: TClassName,
  config: ConfigFromClassName<TClassName>,
): CanvasNodeData<ConfigFromClassName<TClassName>> {
  return {
    attrs: {
      id: "id" in config ? config.id : uuidv4(),
      ...config,
    },
    className,
  };
}
