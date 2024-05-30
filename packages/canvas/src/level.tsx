import { useMemo } from "react";
import * as ReactKonva from "react-konva";
import { useImage } from "react-konva-utils";
import { CanvasLevelBaseData, NodeTags } from "./utils";

export interface CanvasLevelStyle {
  width: number;
  height: number;
  padding: number;
  /** Canvas level background color. Defaults to "white" */
  background?: string;
}

export interface CanvasLevelProps extends CanvasLevelBaseData {
  children?: React.ReactNode;
  style: CanvasLevelStyle;
}

export function CanvasLevel({
  children,
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
    <ReactKonva.Group
      name={"Level"}
      x={position.x}
      y={position.y}
      clipWidth={width}
      clipHeight={height}
    >
      <ReactKonva.Rect
        name={NodeTags.NO_SELECT}
        listening={false}
        width={width}
        height={height}
        fill={background ?? "white"}
        cornerRadius={10}
      />
      <ReactKonva.Image
        name={NodeTags.NO_SELECT}
        listening={false}
        image={image}
        x={padding}
        y={padding}
        scaleX={imageScale}
        scaleY={imageScale}
      />
      {children}
    </ReactKonva.Group>
  );
}
