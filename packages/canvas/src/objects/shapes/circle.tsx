import Konva from "konva";
import { ObjectRendererRenderProps } from "objects/objectRenderer";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { Portal } from "react-konva-utils";
import { usePutIntoTransformer } from "../../hooks";
import { DefaultTransformer } from "../../transformers";
import { CanvasNode, CanvasNodeConfig } from "../../utils";

export type CircleProps = ObjectRendererRenderProps<
  CanvasNode<CanvasNodeConfig>
>;

export function Circle({
  canvas,
  config,
  showTransformer,
  onUpdate,
  ...restProps
}: CircleProps) {
  const circleRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  usePutIntoTransformer(showTransformer, trRef.current, circleRef.current);
  return (
    <>
      <ReactKonva.Circle
        ref={circleRef}
        {...config}
        {...restProps}
        draggable={canvas.editable}
      />
      <Portal selector=".selection-layer">
        <DefaultTransformer ref={trRef} />
      </Portal>
    </>
  );
}
