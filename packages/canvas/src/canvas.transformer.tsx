import Konva from "konva";
import { forwardRef, useMemo } from "react";
import { Transformer } from "react-konva";
import { useCanvasContext } from "./canvas.context";

function createRotationPoints(parts: number) {
  return Array.from({ length: parts }, (_, i) => {
    return Math.min(i * Math.floor(360 / parts), 360);
  });
}

export interface CanvasTransformerProps {
  /** The amount of rotation snaps there are (angle being `θ = 360/x`) */
  snapRotationParts: number;
}

export const CanvasTransformer = forwardRef<
  Konva.Transformer,
  CanvasTransformerProps
>(function CanvasTransformer(props, ref) {
  const ctx = useCanvasContext();
  const rotationSnaps = useMemo(() => {
    if (!ctx.snapping.state) return [];
    return createRotationPoints(props.snapRotationParts);
  }, [props.snapRotationParts, ctx.snapping.state]);

  return (
    <Transformer
      ref={ref}
      rotationSnaps={rotationSnaps}
      keepRatio={false}
      anchorCornerRadius={2}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit the size to at least 5x5 px on resize
        return oldBox.width >= 5 && newBox.width >= 5 ? newBox : oldBox;
      }}
    />
  );
});
