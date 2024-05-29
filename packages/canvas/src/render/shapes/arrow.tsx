import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import { LineTransformer, LineTransformerRef } from "../../transformers";
import { CanvasObjectProps } from "../canvasObjectRenderer";

export const Arrow = forwardRef<
  Konva.Arrow,
  CanvasObjectProps<CanvasNodeConfig<Konva.ArrowConfig>>
>((props, ref) => {
  const {
    data,
    editable: modifiable,
    useSingleTransformer,
    onDragMove,
    onChange,
    ...restProps
  } = props;

  const trRef = useRef<LineTransformerRef>(null);
  const shapeRef = useRef<Konva.Arrow>(null);

  const [shapePos, setShapePos] = useState<Readonly<Vector2d>>({ x: 0, y: 0 });

  useEffect(() => {
    // Always sync position on each rerender, if they differ in any way
    const pos = shapeRef.current?.position();
    if (pos && pos != null && (shapePos.x !== pos.x || shapePos.y !== pos.y))
      setShapePos(pos);
  });

  function scalePoints(scaleX: number, scaleY: number, points: number[]) {
    return points.map((x, i) => x * (i % 2 === 0 ? scaleX : scaleY));
  }

  return (
    <>
      <ReactKonva.Arrow
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        rotation={0 /* Disable rotation */}
        onDragMove={(e) => {
          onDragMove?.(e);
          setShapePos(e.target.position());
        }}
        onTransform={(e) => {
          const node = e.target as Konva.Arrow;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const points = node.points() as number[];
          node.points(scalePoints(scaleX, scaleY, points));
        }}
        onTransformEnd={(e) => {
          const node = e.target as Konva.Arrow;
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
          points={data.attrs.points}
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
