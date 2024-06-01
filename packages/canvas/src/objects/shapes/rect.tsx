import Konva from "konva";
import { ObjectRendererRenderProps } from "objects/objectRenderer";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNode, CanvasNodeCharacterConfig } from "utils/node";
import { usePutIntoTransformer } from "../../hooks";
import { DefaultTransformer } from "../../transformers";

export type RectProps = ObjectRendererRenderProps<
  CanvasNode<CanvasNodeCharacterConfig>
>;

export function Rect({
  canvas,
  config,
  onSave: onChange,
  showTransformer,
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
      />
      <DefaultTransformer ref={trRef} />
    </>
  );
}
