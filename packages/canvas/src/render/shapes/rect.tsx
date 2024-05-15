import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig } from "../../canvas.data";
import { DefaultTransformer } from "../../transformers";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import { useNodesIntoTransformer } from "../canvasShapes";

export const Rect = forwardRef<
  Konva.Rect,
  CanvasObjectProps<CanvasNodeConfig<Konva.RectConfig>>
>(({ data, modifiable, useSingleTransformer, ...restProps }, ref) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  useNodesIntoTransformer(useSingleTransformer, trRef, shapeRef);
  return (
    <>
      <ReactKonva.Rect
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
      />
      {useSingleTransformer && <DefaultTransformer ref={trRef} />}
    </>
  );
});
