import {
  CanvasNode,
  CanvasNodeConfig,
  ObjectRendererRenderProps,
} from "@repo/canvas";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
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
  const [optimisticConfig, setOptimisticConfig] = useState(config);
  useEffect(() => setOptimisticConfig(config), [config]);

  return (
    <>
      <ReactKonva.Rect
        ref={rectRef}
        draggable={canvas.editable}
        {...optimisticConfig}
        {...restProps}
      />
      <RectangleTransformer
        config={optimisticConfig}
        onUpdateConfig={setOptimisticConfig}
        shown={showTransformer}
        link={rectRef.current}
        anchors="stereo"
        keepRatio={false}
      />
    </>
  );
}
