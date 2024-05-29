import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect } from "react-konva";
import { CanvasLevelContextProvider } from "./canvas.context";
import { CanvasLevelNode, CanvasNodeData } from "./canvas.data";
import Vector2d = Konva.Vector2d;

export type CanvasLevelEventType = "create" | "update" | "delete";

export type CanvasLevelEventCallback<
  TNode extends CanvasNodeData = CanvasNodeData,
> = (
  type: CanvasLevelEventType,
  level: CanvasLevelNode<TNode>,
  node: CanvasNodeData,
) => any;

interface CanvasLevelBaseProps<TNode extends CanvasNodeData> {
  width: number;
  height: number;
  /** The whitespace between canvas border and actual level image */
  padding: number;
  level: CanvasLevelNode<TNode>;
  /** The elements shown in this level, besides the background image */
  children: React.ReactNode;
  focused: boolean;
  onFocus: () => any;
  onEvent?: CanvasLevelEventCallback<TNode>;
}

export type CanvasLevelProps<TNode extends CanvasNodeData = CanvasNodeData> =
  Konva.LayerConfig & CanvasLevelBaseProps<TNode>;

export const CanvasLevel = forwardRef<Konva.Layer, CanvasLevelProps>(
  function CanvasLevel(props, ref) {
    const {
      width,
      height,
      padding,
      children,
      level,
      focused,
      onFocus,
      ...restProps
    } = props;
    const [image, setImage] = useState<HTMLImageElement>();
    const layerRef = useRef<Konva.Layer>(null);

    useEffect(() => {
      const image = new Image();
      image.src = level.imageUrl;
      image.onload = () => setImage(image);
      return () => setImage(undefined);
    }, []);

    // The scale of the image, so that it fits in the level's dimensions
    const imageScale: Vector2d = useMemo(() => {
      if (!image) return { x: 0, y: 0 };
      const scale = Math.min(
        (width - 2 * padding) / image.width,
        (height - 2 * padding) / image.height,
      );
      return { x: scale, y: scale };
    }, [image, width, height, padding]);

    return (
      <Layer
        name={"level"}
        ref={mergeRefs(ref, layerRef)}
        width={width}
        height={height}
        x={level.position.x}
        y={level.position.y}
        onClick={() => onFocus()}
        onMouseEnter={() => onFocus()}
        {...restProps}
      >
        <CanvasLevelContextProvider
          value={{ ...(level as any), ref: layerRef }}
        >
          <Rect
            name={"background"}
            width={width}
            height={height}
            fill={"rgb(255,255,255)"}
            strokeScaleEnabled={false}
            stroke={focused ? "rgb(0, 200, 255)" : "rgba(255, 255, 255, .5)"}
            strokeWidth={3}
            cornerRadius={10}
          />
          <KonvaImage
            listening={false}
            image={image}
            scale={imageScale}
            cornerRadius={2}
            x={padding}
            y={padding}
          />
          {children}
        </CanvasLevelContextProvider>
      </Layer>
    );
  },
);
