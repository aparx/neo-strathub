import { DeepReadonly } from "@repo/utils";
import Konva from "konva";
import { useMemo } from "react";

export type ShapePoints = NonNullable<Konva.LineConfig["points"]>;

/**
 * Returns a mapped array of `points` that segments every pair of points into a 2D
 * vectors, containing of `x` and `y`.
 *
 * @param points the one-dimensional, flattened, point array
 */
export function useSegmentCoordinates(points: ShapePoints) {
  return useMemo<DeepReadonly<Konva.Vector2d[]>>(() => {
    if (!points || points.length % 2 !== 0) return [];
    return Array.from({ length: points.length / 2 }, (_, i) => ({
      x: points[2 * i] ?? 0,
      y: points[1 + 2 * i] ?? 0,
    }));
  }, [points]);
}
