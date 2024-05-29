import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import {
  LineTransformer,
  LineTransformerRef,
} from "../../transformers/index.ts";
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
    editable: modifiable,
    useSingleTransformer,
    onChange,
    onDragMove,
    ...restProps
  } = props;

  const shapeRef = useRef<Konva.Line>(null);
  const trRef = useRef<LineTransformerRef>(null);

  const points = data.attrs.points;
  const [shapePos, setShapePos] = useState<Readonly<Vector2d>>(ZERO_VECTOR_2D);

  useEffect(() => {
    const shape = shapeRef.current;
    if (shape) setShapePos(shape.position());
  }, []);

  function scalePoints(scaleX: number, scaleY: number, points: number[]) {
    return points.map((x, i) => x * (i % 2 === 0 ? scaleX : scaleY));
  }

  return (
    <>
      <ReactKonva.Line
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        listening
        rotation={0 /* Disable rotation */}
        name={"Line"}
        onDragMove={(e) => {
          onDragMove?.(e);
          setShapePos(e.target.position());
        }}
        onTransform={(e) => {
          const node = e.target as Line;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const points = node.points() as number[];
          node.points(scalePoints(scaleX, scaleY, points));
        }}
        onTransformEnd={(e) => {
          const node = e.target as Line;
          onChange({
            ...node.attrs,
            points: node.points(),
            x: node.x(),
            y: node.y(),
          });
        }}
      />
      {useSingleTransformer && (
        <LineTransformer
          ref={trRef}
          points={points}
          tension={data.attrs.tension}
          position={shapePos}
          updatePoints={(newPoints) => shapeRef.current?.points(newPoints)}
          onDragComplete={() => {
            onChange({
              ...data.attrs,
              points: shapeRef.current!.points(),
            });
          }}
        />
      )}
    </>
  );
});
