import Konva from "konva";
import { useMemo } from "react";
import * as ReactKonva from "react-konva";
import { useImage } from "react-konva-utils";
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
  /** Canvas level background color. Defaults to "white" */
  background?: string;
}

export interface CanvasLevelProps extends CanvasLevelData {
  children?: React.ReactNode;
  style: CanvasLevelStyle;
}

export function CanvasLevel({
  children,
  id,
  position,
  imageURL,
  style,
}: CanvasLevelProps) {
  const { width, height, padding, background } = style;
  const [image] = useImage(imageURL);
  const imageScale = useMemo(() => {
    if (!image) return undefined;
    return Math.min(
      (width - 2 * padding) / image.width,
      (height - 2 * padding) / image.height,
    );
  }, [image, width, height, padding]);

  return (
    <ReactKonva.Layer
      name={"Level"}
      id={String(id)}
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      clipWidth={width}
      clipHeight={height}
    >
      <ReactKonva.Group listening={false}>
        <ReactKonva.Rect
          name={NodeTags.NO_SELECT}
          width={width}
          height={height}
          fill={background ?? "white"}
          cornerRadius={10}
        />
        <ReactKonva.Image
          name={NodeTags.NO_SELECT}
          image={image}
          x={padding}
          y={padding}
          scaleX={imageScale}
          scaleY={imageScale}
        />
      </ReactKonva.Group>
      {children}
    </ReactKonva.Layer>
  );
}
