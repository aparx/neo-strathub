import {
  CanvasNode,
  CanvasNodeConfig,
  ObjectRendererRenderProps,
} from "@repo/canvas";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import { CircleTransformer } from "./circle.transformer";

export type CircleConfig = Konva.CircleConfig & CanvasNodeConfig;
export type CircleNode = CanvasNode<CircleConfig>;
export type CircleProps = ObjectRendererRenderProps<CircleNode>;

export function Circle({
  config,
  canvas,
  showTransformer,
  onUpdate,
  onSyncCharacter,
  ...restProps
}: CircleProps) {
  const circleRef = useRef<Konva.Circle>(null);
  const [optimisticConfig, setOptimisticConfig] = useState(config);
  useEffect(() => setOptimisticConfig(config), [config]);

  /** Synchronizes the renderer character to this node in a special way */
  function syncCharacter(config: CircleConfig) {
    const { x = 0, y = 0, width, height, radius, scaleX, scaleY } = config;
    //* Since the position origin of a circle is the center, we have to
    //* compensate it for the character outline (handled by the renderer).
    const angleRad = Konva.Util.degToRad(config.rotation || 0);
    const xWidth = (width ?? 2 * (radius ?? 0)) * (scaleX ?? 1) * 0.5;
    const yHeight = (height ?? 2 * (radius ?? 0)) * (scaleY ?? 1) * 0.5;

    onSyncCharacter?.({
      ...config,
      x: x - xWidth * Math.cos(angleRad) - yHeight * Math.sin(-angleRad),
      y: y - yHeight * Math.cos(angleRad) - xWidth * Math.sin(angleRad),
      width: 2 * (config.radius ?? 0),
      height: 2 * (config.radius ?? 0),
    });
  }

  useEffect(() => {
    // Additionally sync on mount
    syncCharacter(optimisticConfig);
  }, [optimisticConfig]);

  return (
    <>
      <ReactKonva.Circle
        ref={circleRef}
        draggable={canvas.editable}
        {...optimisticConfig}
        {...restProps}
        onTransform={(e) => syncCharacter(e.target.attrs)}
        onDragMove={(e) => syncCharacter(e.target.attrs)}
        onTransformEnd={(e) => {
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
            rotation: e.target.rotation(),
            radius: e.target.attrs.radius,
            skewX: e.target.skewX(),
            skewY: e.target.skewY(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
          }));
          syncCharacter(e.target.attrs);
        }}
        onDragEnd={(e) => {
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
          }));
          syncCharacter(e.target.attrs);
        }}
      />
      <CircleTransformer
        config={optimisticConfig}
        onUpdateConfig={setOptimisticConfig}
        shown={showTransformer}
        link={circleRef.current}
        anchors="stereo"
        keepRatio={false}
        rotateEnabled={false /** TODO temporarily: issues with character */}
      />
    </>
  );
}
