import { forwardRef, useRef } from "react";
import Konva from "konva";
import { CanvasObjectProps } from "../canvasObjectRenderer";
import { CanvasNodeConfig } from "../../canvas.data";
import * as ReactKonva from "react-konva";
import { mergeRefs } from "@repo/utils";
import { DefaultTransformer } from "../../transformers";
import { usePutNodesIntoTransformer } from "../canvasShapes";

export const Arrow = forwardRef<
  Konva.Arrow,
  CanvasObjectProps<CanvasNodeConfig<Konva.ArrowConfig>>
>(({ data, modifiable, useSingleTransformer, ...restProps }, ref) => {
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Arrow>(null);
  usePutNodesIntoTransformer(useSingleTransformer, trRef, shapeRef);
  return (
    <>
      <ReactKonva.Arrow
        ref={mergeRefs(ref, shapeRef)}
        draggable={modifiable}
        {...data.attrs}
        {...restProps}
      />
      {useSingleTransformer && <DefaultTransformer ref={trRef} />}
    </>
  );
});