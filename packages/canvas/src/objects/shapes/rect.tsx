import Konva from "konva";
import { ObjectRendererRenderProps } from "objects/objectRenderer";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNode, CanvasNodeConfig } from "utils/node";
import { usePutIntoTransformer } from "../../hooks";
import { DefaultTransformer } from "../../transformers";

export type RectProps = ObjectRendererRenderProps<CanvasNode<CanvasNodeConfig>>;

export function Rect({
  canvas,
  config,
  showTransformer,
  onUpdate,
  ...restProps
}: RectProps) {
  const trRef = useRef<Konva.Transformer>(null);
  const rectRef = useRef<Konva.Rect>(null);
  usePutIntoTransformer(showTransformer, trRef.current, rectRef.current);
  return (
    <>
      <ReactKonva.Rect
        ref={rectRef}
        draggable={canvas.editable}
        {...restProps}
        {...config}
        onTransformEnd={(e) => {
          const node = e.currentTarget;
          // "Erase" scale and use width & height instead for rects
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();
          const newScale: Konva.Vector2d = { x: 1, y: 1 };
          node.scale(newScale);
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: node.x(),
            y: node.y(),
            scale: newScale,
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
          }));
        }}
      />
      <DefaultTransformer ref={trRef} />
    </>
  );
}
