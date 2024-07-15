import Konva from "konva";
import { forwardRef } from "react";
import * as ReactKonva from "react-konva";

export const BasicTransformer = forwardRef<
  Konva.Transformer,
  Konva.TransformerConfig
>(function BasicTransformer(props, ref) {
  return (
    <ReactKonva.Transformer
      ref={ref}
      keepRatio={false}
      anchorCornerRadius={2}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
      enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
      {...props}
    />
  );
});
