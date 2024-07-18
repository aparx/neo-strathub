import Konva from "konva";
import { forwardRef } from "react";
import * as ReactKonva from "react-konva";

export enum TransformerAnchor {
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
  LEFT_CENTER = "middle-left",
  RIGHT_CENTER = "middle-right",
  TOP_CENTER = "top-center",
  BOTTOM_CENTER = "bottom-center",
}

export interface BasicTransformerProps extends Konva.TransformerConfig {
  /** The enabled anchors. Defaults to "mono" */
  anchors?: keyof typeof ANCHORS;
}

const ANCHORS = {
  stereo: [
    TransformerAnchor.TOP_LEFT,
    TransformerAnchor.TOP_RIGHT,
    TransformerAnchor.BOTTOM_LEFT,
    TransformerAnchor.BOTTOM_RIGHT,
    TransformerAnchor.LEFT_CENTER,
    TransformerAnchor.RIGHT_CENTER,
    TransformerAnchor.TOP_CENTER,
    TransformerAnchor.BOTTOM_CENTER,
  ],
  mono: [
    TransformerAnchor.TOP_LEFT,
    TransformerAnchor.TOP_RIGHT,
    TransformerAnchor.BOTTOM_LEFT,
    TransformerAnchor.BOTTOM_RIGHT,
  ],
  none: [],
} as const satisfies Record<string, Readonly<TransformerAnchor[]>>;

export const BasicTransformer = forwardRef<
  Konva.Transformer,
  BasicTransformerProps
>(function BasicTransformer({ anchors = "mono", ...restProps }, ref) {
  return (
    <ReactKonva.Transformer
      ref={ref}
      keepRatio={false}
      anchorCornerRadius={2}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315, 360]}
      enabledAnchors={[...ANCHORS[anchors]]}
      {...restProps}
    />
  );
});
