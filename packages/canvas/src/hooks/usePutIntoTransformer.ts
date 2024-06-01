import { nonNull } from "@repo/utils";
import Konva from "konva";
import { useEffect } from "react";

export function usePutIntoTransformer(
  enabled: boolean,
  transformer: Konva.Transformer | null,
  ...nodes: Array<Konva.Node | null>
) {
  useEffect(() => {
    if (!enabled) transformer?.nodes([]);
    else transformer?.nodes(nodes.filter(nonNull));
  }, [enabled, transformer, ...nodes]);
}
