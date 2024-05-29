import { DeepReadonly } from "@repo/utils";
import Konva from "konva";
import { forwardRef, RefObject, useImperativeHandle, useRef } from "react";
import * as ReactKonva from "react-konva";
import { KonvaNodeEvents } from "react-konva";
import { useCanvas } from "../canvas.context";
import { ShapePoints, useSegmentCoordinates } from "../hooks";

const ANCHOR_OUTLINE = "rgba(0, 155, 255)";

export interface LineTransformerProps {
  points: ShapePoints;
  tension?: Konva.LineConfig["tension"];
  position: Readonly<Konva.Vector2d>;
  updatePoints: (newPoints: number[]) => any;
  onAnchorUpdate?: (index: number, position: Konva.Vector2d) => void;
  onDragComplete?: KonvaNodeEvents["onDragEnd"];
}

export interface LineTransformerRef {
  selection: RefObject<Konva.Line>;
  coordinates: DeepReadonly<Konva.Vector2d[]>;
}

export const LineTransformer = forwardRef<
  LineTransformerRef,
  LineTransformerProps
>(function LineTransformer(props, ref) {
  const {
    points,
    tension,
    position,
    onAnchorUpdate,
    onDragComplete,
    updatePoints,
    ...restProps
  } = props;
  const canvas = useCanvas();
  const coordinates = useSegmentCoordinates(points);
  const selectionRef = useRef<Konva.Line>(null);

  // prettier-ignore
  useImperativeHandle(ref, () => ({
    selection: selectionRef,
    coordinates
  }), [coordinates]);

  function updatePoint(index: number, vector: Konva.Vector2d) {
    onAnchorUpdate?.(index, vector);
    const newPoints = [...points];
    const beginIndex = Math.max(2 * index, 0);
    newPoints[beginIndex] = vector.x;
    newPoints[1 + beginIndex] = vector.y;
    updatePoints(newPoints);
    selectionRef.current?.points(newPoints);
  }

  return (
    <>
      <ReactKonva.Line
        ref={selectionRef}
        listening={false}
        points={points}
        tension={tension}
        x={position.x}
        y={position.y}
        stroke={ANCHOR_OUTLINE}
        strokeWidth={1}
        strokeScaleEnabled={false}
      />
      {coordinates?.map((coordinate, index) => (
        <AnchorPoint
          key={index /* OK */}
          scale={1 / canvas.scale.state}
          x={coordinate.x + position.x}
          y={coordinate.y + position.y}
          draggable
          {...restProps}
          onDragEnd={onDragComplete}
          onDragMove={(e) => {
            const pos = e.target.getLayer()!.getRelativePointerPosition()!;
            updatePoint(index, {
              x: pos.x - position.x,
              y: pos.y - position.y,
            });
          }}
        />
      ))}
    </>
  );
});

export function AnchorPoint({
  scale,
  ...restProps
}: Omit<Konva.CircleConfig, "scaleX" | "scaleY"> &
  KonvaNodeEvents & {
    scale: number;
  }) {
  return (
    <ReactKonva.Circle
      name={"Transformer"}
      radius={5}
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
