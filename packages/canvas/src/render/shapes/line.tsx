import { DeepReadonly, mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { useCanvas } from "../../canvas.context";
import { CanvasNodeConfig } from "../../canvas.data";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import Vector2d = Konva.Vector2d;

const ZERO_VECTOR_2D = { x: 0, y: 0 } as const satisfies Vector2d;

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

  const shapeRef = useRef<Konva.Arrow>(null);
  const points = data.attrs.points;
  const [shapePos, setShapePos] = useState<Readonly<Vector2d>>(ZERO_VECTOR_2D);
  const coordinates = useMemo<DeepReadonly<Vector2d[]>>(() => {
    if (!points || points.length % 2 !== 0) return [];
    return Array.from({ length: points.length / 2 }, (_, i) => ({
      x: points[2 * i] ?? 0,
      y: points[1 + 2 * i] ?? 0,
    }));
  }, [points]);

  function updatePoint(
    index: number,
    mapper: (x: number, y: number) => Vector2d,
  ) {
    const shape = shapeRef.current!;
    const newPoints = [...shape.points()];
    const beginIndex = Math.max(2 * index, 0);
    const oldX = newPoints[beginIndex]!;
    const oldY = newPoints[1 + beginIndex]!;
    const { x: newX, y: newY } = mapper(oldX, oldY);
    newPoints[beginIndex] = newX;
    newPoints[1 + beginIndex] = newY;
    shape.points(newPoints);
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
        onDragMove={(e) => {
          onDragMove?.(e);
          setShapePos({ x: e.target.x(), y: e.target.y() });
        }}
      />
      {useSingleTransformer &&
        coordinates?.map((coordinate, index) => (
          <LineAnchor
            key={index}
            x={coordinate.x + shapePos.x}
            y={coordinate.y + shapePos.y}
            updatePoint={(mapper) => updatePoint(index, mapper)}
            saveChanges={() =>
              onChange({
                ...data.attrs,
                points: shapeRef.current!.points(),
              })
            }
          />
        ))}
    </>
  );
});

function LineAnchor({
  x,
  y,
  updatePoint,
  saveChanges,
}: {
  x: number;
  y: number;
  updatePoint?: (mapper: (x: number, y: number) => Vector2d) => void;
  saveChanges?: () => void;
}) {
  const canvas = useCanvas();
  const scale = 1 / canvas.scale.state;

  return (
    <ReactKonva.Circle
      name={"Transformer"}
      x={x}
      y={y}
      radius={5}
      scaleX={scale}
      scaleY={scale}
      fill={"white"}
      stroke={"rgba(0, 155, 255)"}
      strokeWidth={1}
      strokeEnabled
      strokeScaleEnabled={false}
      draggable
      onDragEnd={() => saveChanges?.()}
      onDragMove={(e) =>
        updatePoint?.((x, y) => ({
          x: x + e.evt.movementX * scale,
          y: y + e.evt.movementY * scale,
        }))
      }
    />
  );
}
