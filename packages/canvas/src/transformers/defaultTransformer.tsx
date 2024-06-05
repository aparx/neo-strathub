import Konva from "konva";
import { forwardRef } from "react";
import * as ReactKonva from "react-konva";

export const DefaultTransformer = forwardRef<
  Konva.Transformer,
  Konva.TransformerConfig
>(function DefaultTransformer(props, ref) {
  return (
    <ReactKonva.Transformer
      ref={ref}
      keepRatio={false}
      anchorCornerRadius={2}
      {...props}
    />
  );
});
