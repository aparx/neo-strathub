import Konva from "konva";
import { forwardRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../canvas.data";
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

export const PRIMITIVE_CANVAS_SHAPES = {
  Rect,
  Circle,
  Arrow,
  Line,
} as const;
