import { DeepReadonly, mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { KonvaNodeEvents } from "react-konva";
import { useCanvas } from "../../canvas.context";
import { CanvasNodeConfig } from "../../canvas.data";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import Vector2d = Konva.Vector2d;

const ZERO_VECTOR_2D = { x: 0, y: 0 } as const satisfies Vector2d;
const ANCHOR_OUTLINE = "rgba(0, 155, 255)";

export const Line = forwardRef<
  Konva.Line,
  CanvasObjectProps<CanvasNodeConfig<Konva.LineConfig>>
>((props, ref) => {
  const {
    data,
    modifiable,
    useSingleTransformer,
    onChange,
    onDragMove,
    ...restProps
  } = props;

  const canvas = useCanvas();
  const anchorScale = 1 / canvas.scale.state;

  const shapeRef = useRef<Konva.Line>(null);
  const shapeSelectionRef = useRef<Konva.Line>(null);
  const points = data.attrs.points;
  const [shapePos, setShapePos] = useState<Readonly<Vector2d>>(ZERO_VECTOR_2D);
  const coordinates = useMemo<DeepReadonly<Vector2d[]>>(() => {
    if (!points || points.length % 2 !== 0) return [];
    return Array.from({ length: points.length / 2 }, (_, i) => ({
      x: points[2 * i] ?? 0,
      y: points[1 + 2 * i] ?? 0,
    }));
  }, [points]);

  function updatePoint(index: number, vector: Vector2d) {
    const shape = shapeRef.current!;
    const newPoints = [...shape.points()];
    const beginIndex = Math.max(2 * index, 0);
    newPoints[beginIndex] = vector.x;
    newPoints[1 + beginIndex] = vector.y;
    shape.points(newPoints);
    shapeSelectionRef.current?.points(newPoints);
    shape.getLayer()?.batchDraw();
  }

  useEffect(() => {
    // Initial position update, whenever `shapeRef` is resolved
    const shape = shapeRef.current;
    if (shape) setShapePos({ x: shape.x(), y: shape.y() });
  }, []);

  return (
    <>
      <ReactKonva.Line
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        listening
        lineJoin={"round"}
        lineCap={"round"}
        onDragMove={(e) => {
          onDragMove?.(e);
          setShapePos({ x: e.target.x(), y: e.target.y() });
        }}
      />
      {useSingleTransformer && (
        <ReactKonva.Line
          ref={shapeSelectionRef}
          listening={false}
          {...data.attrs}
          x={shapePos.x}
          y={shapePos.y}
          stroke={ANCHOR_OUTLINE}
          strokeWidth={1}
          strokeScaleEnabled={false}
        />
      )}
      {useSingleTransformer &&
        coordinates?.map((coordinate, index) => (
          <AnchorPoint
            key={index /* OK */}
            scale={anchorScale}
            x={coordinate.x + shapePos.x}
            y={coordinate.y + shapePos.y}
            draggable
            onDragEnd={() => {
              onChange({
                ...data.attrs,
                points: shapeRef.current!.points(),
              });
            }}
            onDragMove={(e) => {
              const pos = e.target.getLayer()!.getRelativePointerPosition()!;
              updatePoint(index, {
                x: pos.x - shapePos.x,
                y: pos.y - shapePos.y,
              });
            }}
          />
        ))}
    </>
  );
});

function AnchorPoint({
  scale,
  ...restProps
}: Omit<Konva.CircleConfig, "scaleX" | "scaleY"> &
  KonvaNodeEvents & {
    scale: number;
  }) {
  return (
    <ReactKonva.Circle
      name={"Transformer"}
      radius={4}
      scaleX={scale}
      scaleY={scale}
      fill={"white"}
      stroke={ANCHOR_OUTLINE}
      strokeWidth={1}
      strokeEnabled
      strokeScaleEnabled={false}
      {...restProps}
    />
  );
}
