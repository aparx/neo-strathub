import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import { DefaultTransformer } from "../../transformers";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import { useNodesIntoTransformer } from "../canvasShapes";

export const Circle = forwardRef<
  Konva.Circle,
  CanvasObjectProps<CanvasNodeConfig<Konva.CircleConfig>>
>(({ data, modifiable, useSingleTransformer, onChange, ...restProps }, ref) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Circle>(null);
  useNodesIntoTransformer(useSingleTransformer, trRef, shapeRef);
  return (
    <>
      <ReactKonva.Circle
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        onTransformEnd={(e) => {
          const node = e.target;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...node.attrs,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.width() * scaleY),
            radius: undefined,
          });
        }}
      />
      {useSingleTransformer && <DefaultTransformer ref={trRef} />}
    </>
  );
});
