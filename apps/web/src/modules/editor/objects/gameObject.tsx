import {
  CanvasContext,
  CanvasNode,
  CanvasNodeConfig,
  NodeTags,
  ObjectRendererRenderProps,
  usePutIntoTransformer,
} from "@repo/canvas";
import { DefaultTransformer } from "@repo/canvas/src/transformers";
import Konva from "konva";
import { useCallback, useRef } from "react";
import * as ReactKonva from "react-konva";
import { Portal, useImage } from "react-konva-utils";

export type GameObjectProps = ObjectRendererRenderProps<
  CanvasNode<GameObjectConfig>
>;

export type GameObjectConfig = CanvasNodeConfig &
  (
    | {
        objectType: "character";
        objectId: number | undefined;
        /** If true, gets the object based on the `characterId` */
        linkToAssignee?: boolean;
      }
    | {
        objectType: string;
        objectId: number;
        linkToAssignee: never;
      }
  );

export function GameObject(props: GameObjectProps) {
  const { canvas, config } = props;
  const context = canvas as CanvasContext;
  const { objectType, objectId, linkToAssignee, characterId } = config;
  const finalObjectId =
    objectType === "character" && linkToAssignee && characterId
      ? context.getCharacterSlot(characterId)?.objectId
      : objectId;

  const imageUrl = finalObjectId
    ? context.getGameObjectURL(finalObjectId, objectType)
    : "https://svgur.com/i/1711.svg"; // TODO other fallback

  return imageUrl && <ImageObject {...props} imageUrl={imageUrl} />;
}

function ImageObject({
  canvas,
  config,
  showTransformer,
  onUpdate,
  onDragMove,
  imageUrl,
  ...restProps
}: GameObjectProps & { imageUrl: string }) {
  const [image] = useImage(imageUrl);
  const backRef = useRef<Konva.Rect>(null);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  /** Calculates the scale of the image based on the given dimensions */
  function calculateScale(width: number, height: number) {
    if (!image) return undefined;
    return Math.min(width / image.width, height / image.height);
  }

  /** Syncs some attributes of the background to the given `node` */
  const syncBackground = useCallback((node: Konva.Node) => {
    backRef.current?.setAttrs({
      x: node.x(),
      y: node.y(),
      width: node.width(),
      height: node.height(),
      rotation: node.rotation(),
      skewX: node.skewX(),
      skewY: node.skewY(),
    });
  }, []);

  const imageScale = calculateScale(config.width ?? 1, config.height ?? 1);

  usePutIntoTransformer(showTransformer, trRef.current, imageRef.current);

  return (
    <>
      <ReactKonva.Rect
        ref={backRef}
        name={NodeTags.NO_SELECT}
        listening={false}
        fill="rgb(0, 0, 0, .6)"
        x={config.x}
        y={config.y}
        width={config.width}
        height={config.height}
        rotation={config.rotation}
      />
      <ReactKonva.Rect
        ref={imageRef}
        image={image}
        {...config}
        {...restProps}
        fillPatternRepeat="no-repeat"
        fillPatternImage={image}
        fillPatternScaleX={imageScale}
        fillPatternScaleY={imageScale}
        draggable={canvas.editable}
        onDragMove={(e) => {
          onDragMove?.(e);
          syncBackground(e.target);
        }}
        onTransform={(e) => {
          const node = e.target;
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();
          const imageScale = calculateScale(newWidth, newHeight);
          node.setAttrs({
            scaleX: 1,
            scaleY: 1,
            width: newWidth,
            height: newHeight,
            fillPatternScaleX: imageScale,
            fillPatternScaleY: imageScale,
          });
          syncBackground(node);
        }}
        onTransformEnd={(e) => {
          // Disable scaling in return for using width and height
          const node = e.target;
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();
          node.setAttrs({
            scaleX: 1,
            scaleY: 1,
            width: newWidth,
            height: newHeight,
          });
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
            rotation: node.rotation(),
            skewX: node.skewX(),
            skewY: node.skewY(),
            scaleX: 1,
            scaleY: 1,
          }));
        }}
      />
      <Portal selector=".selection-layer">
        <DefaultTransformer
          ref={trRef}
          keepRatio
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      </Portal>
    </>
  );
}
