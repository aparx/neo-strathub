import { nonNull, Nullish } from "@repo/utils";
import Konva from "konva";
import { useEffect } from "react";

export function usePutIntoTransformer(
  enabled: boolean,
  transformer: Konva.Transformer | Nullish,
  ...nodes: Array<Konva.Node | Nullish>
) {
  useEffect(() => {
    if (!enabled) transformer?.nodes([]);
    else transformer?.nodes(nodes.filter(nonNull));
  }, [enabled, transformer, ...nodes]);
}
