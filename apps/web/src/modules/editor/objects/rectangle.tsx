import {
  CanvasNode,
  CanvasNodeConfig,
  ObjectRendererRenderProps,
} from "@repo/canvas";
import Konva from "konva";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { RectangleTransformer } from "./rectangle.transformer";

export type RectangleConfig = CanvasNodeConfig;
export type RectangleNode = CanvasNode<RectangleConfig>;
export type RectangleProps = ObjectRendererRenderProps<RectangleNode>;

export function Rectangle({
  config,
  canvas,
  showTransformer,
  ...restProps
}: RectangleProps) {
  const rectRef = useRef<Konva.Rect>(null);

  return (
    <>
      <ReactKonva.Rect
        ref={rectRef}
        draggable={canvas.editable}
        {...config}
        {...restProps}
      />
      <RectangleTransformer
        config={config}
        shown={showTransformer}
        link={rectRef.current}
        anchors="stereo"
        keepRatio={false}
      />
    </>
  );
}
