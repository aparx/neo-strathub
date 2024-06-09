import {
  CanvasContext,
  CanvasNode,
  CanvasNodeConfig,
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
        objectId: number;
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
    : undefined;

  return imageUrl && <ImageObject {...props} imageUrl={imageUrl} />;
}

function ImageObject({
  canvas,
  config,
  showTransformer,
  onUpdate,
  imageUrl,
  ...restProps
}: GameObjectProps & { imageUrl: string }) {
  const [image] = useImage(imageUrl);
  const imageRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const calculateScale = useCallback(
    (width: number, height: number) => {
      return image
        ? Math.min(width / image.width, height / image.height)
        : undefined;
    },
    [image],
  );

  const imageScale = calculateScale(config.width ?? 1, config.height ?? 1);

  usePutIntoTransformer(showTransformer, trRef.current, imageRef.current);

  return (
    <>
      <ReactKonva.Rect
        ref={imageRef}
        image={image}
        {...config}
        {...restProps}
        fillPatternImage={image}
        fillPatternScaleX={imageScale}
        fillPatternScaleY={imageScale}
        draggable={canvas.editable}
        onTransform={(e) => {
          const node = e.target;
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();
          node.scale({ x: 1, y: 1 });

          node.width(newWidth);
          node.height(newHeight);
          const imageScale = calculateScale(newWidth, newHeight);
          node.setAttrs({
            fillPatternScaleX: imageScale,
            fillPatternScaleY: imageScale,
          });
        }}
        onTransformEnd={(e) => {
          // Disable scaling in return for using width and height
          const node = e.target;
          const newWidth = node.width() * node.scaleX();
          const newHeight = node.height() * node.scaleY();
          node.scale({ x: 1, y: 1 });

          node.width(newWidth);
          node.height(newHeight);

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
