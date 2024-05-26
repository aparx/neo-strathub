import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import { DefaultTransformer } from "../../transformers";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import { usePutNodesIntoTransformer } from "../canvasShapes";

export const Circle = forwardRef<
  Konva.Circle,
  CanvasObjectProps<CanvasNodeConfig<Konva.CircleConfig>>
>(({ data, modifiable, useSingleTransformer, onChange, ...restProps }, ref) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Circle>(null);
  usePutNodesIntoTransformer(useSingleTransformer, trRef, shapeRef);
  return (
    <>
      <ReactKonva.Circle
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
        name={"Circle"}
        onTransformEnd={(e) => {
          // For circles, width and height equal the radius, thus scale must be used
          const node = e.target;
          onChange({
            ...node.attrs,
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            width: node.width(),
            height: node.height(),
          });
        }}
      />
      {useSingleTransformer && <DefaultTransformer ref={trRef} />}
    </>
  );
});
