import { CanvasContext } from "context/canvasContext";
import { SetStateAction, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNode, InferNodeConfig } from "../utils";
import { CharacterRect, CharacterRectRef } from "./characterRect";

/** Props passed through the renderer wrapper to the actual renderer */
export interface ObjectRendererDrillProps<TNode extends CanvasNode>
  extends ReactKonva.KonvaNodeEvents {
  canvas: CanvasContext;
  /** Event hook called to save and push the node's changes */
  onUpdate: (newConfig: SetStateAction<InferNodeConfig<TNode>>) => any;
}

/** The receiving props for the internally used (actual) renderer */
export interface ObjectRendererRenderProps<
  TNode extends CanvasNode = CanvasNode,
> extends ObjectRendererDrillProps<TNode> {
  config: TNode["attrs"];
  /** If true, only a single selection transformer should be shown for node */
  showTransformer: boolean;

  /** Called to synchronize the character outline with the node */
  onSyncCharacter?: (config: InferNodeConfig<TNode>) => void;
}

/** Each object renderer associated to their identifying `className` */
export interface ObjectRendererLookupTable<TNode extends CanvasNode> {
  [className: string]: React.FC<ObjectRendererRenderProps<TNode>>;
}

export interface ObjectRendererProps<TNode extends CanvasNode = CanvasNode>
  extends ObjectRendererDrillProps<TNode> {
  children: TNode;
  renderers: ObjectRendererLookupTable<TNode>;
}

export function ObjectRenderer<TNode extends CanvasNode>({
  canvas,
  children,
  renderers,
  onUpdate,
  onDragMove,
  onDragStart,
  onDragEnd,
  onTransform,
  onTransformEnd,
  ...restProps
}: ObjectRendererProps<TNode>) {
  const characterRef = useRef<CharacterRectRef>(null);

  const selected = canvas.selected.state;
  const isIndividualSelection =
    selected.length === 1 && selected[0] === children.attrs?.id;

  const Renderer = renderers[children.className];
  if (Renderer == null)
    throw new Error(`Object '${children.className}' unsupported`);

  //* Gets the color from character (`children.characterId`)
  const characterSlot =
    children.attrs.characterId != null
      ? canvas.onGetCharacterSlot(children.attrs.characterId)
      : null;

  return (
    <>
      <Renderer
        config={children.attrs}
        canvas={canvas}
        showTransformer={isIndividualSelection}
        onSyncCharacter={(config) => characterRef.current?.sync(config)}
        onTransform={(e) => {
          onTransform?.(e);
          characterRef.current?.sync(e.target.attrs);
        }}
        onDragMove={(e) => {
          onDragMove?.(e);
          characterRef.current?.sync(e.target.attrs);
        }}
        onDragStart={(e) => {
          onDragStart?.(e);
          canvas.selected.update((current) => {
            const targetId = e.target.attrs.id;
            if (typeof targetId === "string" && !current.includes(targetId))
              // TODO if shift/alt is pressed, include the previous selected ids
              return [targetId];
            return current;
          });
        }}
        onTransformEnd={(e) => {
          // Default behaviour of `onTransformEnd`
          onTransformEnd?.(e);
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
            rotation: e.target.rotation(),
            skewX: e.target.skewX(),
            skewY: e.target.skewY(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
            scale: {
              x: e.target.scaleX(),
              y: e.target.scaleY(),
            },
          }));
        }}
        onDragEnd={(e) => {
          // Default behaviour of `onDragEnd`
          onDragEnd?.(e);
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
          }));
        }}
        onUpdate={onUpdate}
        {...restProps}
      />
      {characterSlot && (
        <CharacterRect ref={characterRef} slot={characterSlot} />
      )}
    </>
  );
}
