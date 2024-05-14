import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect } from "react-konva";
import { CanvasLevelContextProvider } from "./canvas.context";
import { CanvasLevelNode } from "./canvas.data";
import Vector2d = Konva.Vector2d;

export interface CanvasLevelProps<
  TNode extends Konva.NodeConfig = Konva.NodeConfig,
> extends Konva.LayerConfig {
  width: number;
  height: number;
  level: CanvasLevelNode<TNode>;
  /** The elements shown in this level, besides the background image */
  children: React.ReactNode;
}

export const CanvasLevel = forwardRef<Konva.Layer, CanvasLevelProps>(
  function CanvasLevel(props, ref) {
    const { width, height, children, level, ...restProps } = props;
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
      const scale = Math.min(width / image.width, height / image.height);
      return { x: scale, y: scale };
    }, [image, width, height]);

    return (
      <Layer
        name={"level"}
        ref={mergeRefs(ref, layerRef)}
        width={width}
        height={height}
        x={level.position.x}
        y={level.position.y}
        {...restProps}
      >
        <CanvasLevelContextProvider value={{ ...level, ref: layerRef }}>
          <Rect
            width={width}
            height={height}
            listening={false}
            fill={"rgb(218,218,218)"}
            stroke={"rgba(255, 255, 255, .5)"}
            strokeWidth={2}
            cornerRadius={10}
          />
          <KonvaImage
            listening={false}
            image={image}
            scale={imageScale}
            cornerRadius={2}
          />
          {children}
        </CanvasLevelContextProvider>
      </Layer>
    );
  },
);
