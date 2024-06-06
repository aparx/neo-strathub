import Konva from "konva";
import { ObjectRendererRenderProps } from "objects/objectRenderer";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { Portal } from "react-konva-utils";
import { usePutIntoTransformer } from "../../hooks";
import { DefaultTransformer } from "../../transformers";
import { CanvasNode, CanvasNodeConfig } from "../../utils";

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
          const node = e.target;
          const newWidth = node.scaleX() * node.width();
          const newHeight = node.scaleY() * node.height();
          node.scaleX(1);
          node.scaleY(1);
          onUpdate((oldConfig) => ({
            ...oldConfig,
            rotation: node.rotation(),
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1,
            scale: { x: 1, y: 1 },
          }));
        }}
      />
      <Portal selector=".selection-layer">
        <DefaultTransformer ref={trRef} />
      </Portal>
    </>
  );
}
