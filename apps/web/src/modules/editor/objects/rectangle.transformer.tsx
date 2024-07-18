import { CanvasNodeConfig } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Flexbox } from "@repo/ui/components";
import Konva from "konva";
import { forwardRef } from "react";
import { BaseTransformer, BaseTransformerData } from "./baseTransformer";
import * as OverlayItem from "./items";

export const RectangleTransformer = forwardRef<
  Konva.Transformer,
  BaseTransformerData<CanvasNodeConfig>
>(function GameObjectTransformer(
  { config, ...restProps },
  ref,
) {
  const items = [
    <OverlayItem.Duplicate key="duplicate" />,
    <OverlayItem.Copy key="copy" />,
    <OverlayItem.Delete key="delete" />,
  ] as const;

  return (
    <BaseTransformer ref={ref} config={config} {...restProps}>
      <Flexbox asChild gap="sm" style={{ marginLeft: vars.spacing.xs }}>
        <ul aria-label="Default Tools" style={{ listStyle: "none" }}>
          {items.map((item) => item && <li key={item.key}>{item}</li>)}
        </ul>
      </Flexbox>
    </BaseTransformer>
  );
});
