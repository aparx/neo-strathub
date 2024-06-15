import Konva from "konva";
import { forwardRef, useMemo } from "react";
import * as ReactKonva from "react-konva";
import { useCanvasImage } from "./context";
import { NodeTags } from "./utils";

export interface CanvasLevelData {
  readonly id: number;
  readonly position: Readonly<Konva.Vector2d>;
  readonly imageURL: string;
}

export interface CanvasLevelStyle {
  width: number;
  height: number;
  padding: number;
  /** Color used for the outline of the level to indicate it being focused */
  focusStroke: string;
  /** Padding applied to the clipping, useful for strokes */
  clipPadding?: number;
  /** Canvas level background color. Defaults to "white" */
  background?: string;
}

export type CanvasLevelProps = ReactKonva.KonvaNodeEvents &
  Omit<Konva.RectConfig, keyof CanvasLevelData> &
  CanvasLevelData & {
    children?: React.ReactNode;
    style: CanvasLevelStyle;
  };

export const CanvasLevel = forwardRef<Konva.Layer, CanvasLevelProps>(
  ({ children, id, position, imageURL, style, ...restProps }, ref) => {
    const { width, height, padding, background, clipPadding } = style;
    const finalClipPadding = clipPadding ?? 0;

    const image = useCanvasImage(imageURL);

    const imageScale = useMemo(() => {
      if (!image) return undefined;
      return Math.min(
        (width - 2 * padding) / image.width,
        (height - 2 * padding) / image.height,
      );
    }, [image, width, height, padding]);

    return (
      <ReactKonva.Layer
        ref={ref}
        name={NodeTags.LEVEL_LAYER}
        id={String(id)}
        x={position.x}
        y={position.y}
        clipX={-finalClipPadding}
        clipY={-finalClipPadding}
        clipWidth={width + 2 * finalClipPadding}
        clipHeight={height + 2 * finalClipPadding}
      >
        <ReactKonva.Rect
          name={NodeTags.NO_SELECT}
          width={width}
          height={height}
          fill={background ?? "white"}
          cornerRadius={10}
          {...restProps}
        />
        {image && (
          <ReactKonva.Image
            listening={false}
            name={NodeTags.NO_SELECT}
            image={image}
            x={padding}
            y={padding}
            scaleX={imageScale}
            scaleY={imageScale}
          />
        )}
        {children}
      </ReactKonva.Layer>
    );
  },
);
