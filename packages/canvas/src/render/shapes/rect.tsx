import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import { DefaultTransformer } from "../../transformers";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import { usePutNodesIntoTransformer } from "../canvasShapes";

export const Rect = forwardRef<
  Konva.Rect,
  CanvasObjectProps<CanvasNodeConfig<Konva.RectConfig>>
>(({ data, modifiable, useSingleTransformer, onChange, ...restProps }, ref) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  usePutNodesIntoTransformer(useSingleTransformer, trRef, shapeRef);

  return (
    <>
      <ReactKonva.Rect
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        name={"Rect"}
        onTransformEnd={(e) => {
          // Scale back and use width and height instead of scale
          const node = e.target as Konva.Node;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...node.attrs,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {useSingleTransformer && <DefaultTransformer ref={trRef} />}
    </>
  );
});
