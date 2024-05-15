import Konva from "konva";
import { forwardRef, useMemo } from "react";
import { Transformer } from "react-konva";
import { useCanvas } from "../canvas.context";

function createRotationPoints(parts: number) {
  return Array.from({ length: parts }, (_, i) => {
    return Math.min(i * Math.floor(360 / parts), 360);
  });
}

export interface CanvasTransformerProps extends Konva.TransformerConfig {
  /** The amount of rotation snaps there are (angle being `θ = 360/x`) */
  snapRotationParts?: number;
}

/** Transformer handling (multiple) selected elements primitively */
export const DefaultTransformer = forwardRef<
  Konva.Transformer,
  CanvasTransformerProps
>(function DefaultTransformer(props, ref) {
  const { snapRotationParts = 8 /* 45deg */, ...restProps } = props;

  const ctx = useCanvas();
  const rotationSnaps = useMemo(() => {
    if (!ctx.snapping.state) return [];
    return createRotationPoints(snapRotationParts);
  }, [snapRotationParts, ctx.snapping.state]);

  return (
    <Transformer
      ref={ref}
      rotationSnaps={rotationSnaps}
      useSingleNodeRotation={true}
      keepRatio={false}
      rotationSnapTolerance={10}
      shouldOverdrawWholeArea={true}
      anchorCornerRadius={2}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit the size to at least 5x5 px on resize
        return oldBox.width >= 5 && newBox.width >= 5 ? newBox : oldBox;
      }}
      {...restProps}
    />
  );
});
