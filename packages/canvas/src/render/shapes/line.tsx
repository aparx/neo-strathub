import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as ReactKonva from "react-konva";
import { useCanvas } from "../../canvas.context";
import { CanvasNodeConfig } from "../../canvas.data";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import Vector2d = Konva.Vector2d;

export const Line = forwardRef<
  Konva.Line,
  CanvasObjectProps<CanvasNodeConfig<Konva.LineConfig>>
>(({ data, modifiable, useSingleTransformer, onChange, ...restProps }, ref) => {
  const canvas = useCanvas();
  const shapeRef = useRef<Konva.Arrow>(null);
  const points = data.attrs.points;
  const [pos, setPos] = useState<Vector2d>({ x: 0, y: 0 });
  const coordinates = useMemo(() => {
    if (!points || points.length % 2 !== 0) return [];
    const array = new Array<Vector2d>();
    for (let i = 0; i < points.length / 2; ++i) {
      array[i] = { x: points[2 * i] ?? 0, y: points[1 + 2 * i] ?? 0 };
    }
    console.log(array, points.length);
    return array;
  }, [points]);

  const anchorRefs = useRef<RefObject<Konva.Circle>[]>([]);

  useEffect(() => {
    anchorRefs.current = [];
  }, [useSingleTransformer]);

  function updatePoint(
    index: number,
    mapper: (x: number, y: number) => [x: number, y: number],
  ) {
    const shape = shapeRef.current!;
    const newPoints = [...shape.points()];
    const beginIndex = Math.max(2 * index, 0);
    const oldX = newPoints[beginIndex]!;
    const oldY = newPoints[1 + beginIndex]!;
    const [newX, newY] = mapper(oldX, oldY);
    newPoints[beginIndex] = newX;
    newPoints[1 + beginIndex] = newY;
    shape.points(newPoints);
    shape.getLayer()!.batchDraw();
  }

  useEffect(() => {
    setPos({ x: shapeRef.current!.x(), y: shapeRef.current!.y() });
  }, []);

  return (
    <>
      <ReactKonva.Line
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        tension={0}
        onDragMove={(e) => setPos({ x: e.target.x(), y: e.target.y() })}
      />
      {useSingleTransformer &&
        coordinates?.map((coordinate, index) => (
          <ReactKonva.Circle
            key={index}
            name={"Transformer"}
            x={coordinate.x + pos.x}
            y={coordinate.y + pos.y}
            radius={5}
            scale={{
              x: 1 / canvas.scale.state,
              y: 1 / canvas.scale.state,
            }}
            fill={"white"}
            stroke={"rgba(0, 155, 255)"}
            strokeWidth={1}
            strokeEnabled
            strokeScaleEnabled={false}
            draggable
            onDragMove={(e) =>
              updatePoint(index, (x, y) => [
                x + e.evt.movementX * (1 / canvas.scale.state),
                y + e.evt.movementY * (1 / canvas.scale.state),
              ])
            }
            onDragEnd={() =>
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
