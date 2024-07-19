import {
  CanvasNode,
  CanvasNodeConfig,
  ObjectRendererRenderProps,
} from "@repo/canvas";
import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { Stage } from "konva/lib/Stage";
import { useEffect, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { CircleTransformer } from "./circle.transformer";

export type CircleConfig = CanvasNodeConfig;
export type CircleNode = CanvasNode<CircleConfig>;
export type CircleProps = ObjectRendererRenderProps<CircleNode>;

export function Circle({
  config,
  canvas,
  showTransformer,
  onUpdate,
  onTransform,
  onDragMove,
  onSyncCharacter,
  ...restProps
}: CircleProps) {
  const circleRef = useRef<Konva.Circle>(null);
  const [optimisticConfig, setOptimisticConfig] = useState(config);
  useEffect(() => setOptimisticConfig(config), [config]);

  const { x, y, width, height, scaleX, scaleY } = optimisticConfig;

  const createOffsetPosition = (node: Shape<ShapeConfig> | Stage) => ({
    x: node.x() - node.width() * node.scaleX() * 0.5,
    y: node.y() - node.height() * node.scaleY() * 0.5,
  });

  return (
    <>
      <ReactKonva.Circle
        ref={circleRef}
        draggable={canvas.editable}
        {...optimisticConfig}
        x={(x ?? 0) + (width ?? 0) * (scaleX ?? 1) * 0.5}
        y={(y ?? 0) + (height ?? 0) * (scaleY ?? 1) * 0.5}
        {...restProps}
        onTransform={(e) => {
          onTransform?.(e); // TODO check if needed
          onSyncCharacter?.({
            ...e.target.attrs,
            ...createOffsetPosition(e.target),
            width: 2 * e.target.attrs.radius,
            height: 2 * e.target.attrs.radius,
          });
        }}
        onDragMove={(e) => {
          onDragMove?.(e); // TODO check if needed
          onSyncCharacter?.({
            ...e.target.attrs,
            ...createOffsetPosition(e.target),
            width: 2 * e.target.attrs.radius,
            height: 2 * e.target.attrs.radius,
          });
        }}
        onTransformEnd={(e) => {
          onUpdate((oldConfig) => ({
            ...oldConfig,
            ...createOffsetPosition(e.target),
            rotation: e.target.rotation(),
            skewX: e.target.skewX(),
            skewY: e.target.skewY(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
          }));
        }}
        onDragEnd={(e) => {
          onUpdate((oldConfig) => ({
            ...oldConfig,
            ...createOffsetPosition(e.target),
          }));
        }}
      />
      <CircleTransformer
        config={optimisticConfig}
        onUpdateConfig={setOptimisticConfig}
        shown={showTransformer}
        link={circleRef.current}
        anchors="stereo"
        keepRatio={false}
      />
    </>
  );
}
