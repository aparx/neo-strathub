import { CanvasContext } from "context/canvasContext";
import Konva from "konva";
import { SetStateAction, useEffect, useRef } from "react";
import * as ReactKonva from "react-konva";
import {
  CanvasNode,
  CanvasNodeConfig,
  InferNodeConfig,
  NodeTags,
} from "../utils";

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
}

/** Each object renderer associated to their identifying `className` */
export interface ObjectRendererLookupTable<TNode extends CanvasNode> {
  [className: string]: React.FC<ObjectRendererRenderProps<TNode>>;
}

export interface ObjectRendererProps<TNode extends CanvasNode>
  extends ObjectRendererDrillProps<TNode> {
  children: TNode;
  renderers: ObjectRendererLookupTable<TNode>;
}

export function ObjectRenderer<TNode extends CanvasNode>({
  canvas,
  children,
  renderers,
  onUpdate,
  ...restProps
}: ObjectRendererProps<TNode>) {
  const assignRef = useRef<Konva.Rect>(null);

  const selected = canvas.selected.state;
  const isIndividualSelection =
    selected.length === 1 && selected[0] === children.attrs?.id;
  const Renderer = renderers[children.className];
  if (Renderer == null)
    throw new Error(`Object '${children.className}' unsupported`);

  /** Syncs some of the `referee`'s attributes with the "assignee" */
  function updateAssign(config: CanvasNodeConfig & Konva.CircleConfig) {
    const assignee = assignRef.current;
    if (!assignee) return;
    const x = config.x ?? 0;
    const y = config.y ?? 0;
    const width = (config.width ?? 0) * (config.scaleX ?? 1);
    const height = (config.height ?? 0) * (config.scaleY ?? 1);

    assignee.position({ x, y });
    assignee.scale({ x: 1, y: 1 });
    assignee.rotation(config.rotation ?? 0);
    assignee.width(width);
    assignee.height(height);
  }

  useEffect(() => updateAssign(children.attrs), []);

  return (
    <>
      <Renderer
        config={children.attrs}
        canvas={canvas}
        showTransformer={isIndividualSelection}
        onTransform={(e) => updateAssign(e.target.attrs)}
        onDragMove={(e) => updateAssign(e.target.attrs)}
        onDragStart={(e) => {
          canvas.selected.update((current) => {
            const targetId = e.target.attrs.id;
            if (typeof targetId === "string" && !current.includes(targetId))
              // TODO if shift/alt is pressed, include the previous selected ids
              return [targetId];
            return current;
          });
        }}
        onTransformEnd={(e) =>
          // Default behaviour of `onTransformEnd`
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
            rotation: e.target.rotation(),
            scaleX: e.target.scaleX(),
            scaleY: e.target.scaleY(),
            scale: {
              x: e.target.scaleX(),
              y: e.target.scaleY(),
            },
          }))
        }
        onDragEnd={(e) =>
          // Default behaviour of `onDragEnd`
          onUpdate((oldConfig) => ({
            ...oldConfig,
            x: e.target.x(),
            y: e.target.y(),
          }))
        }
        onUpdate={onUpdate}
        {...restProps}
      />
      <ReactKonva.Rect
        ref={assignRef}
        id={undefined}
        listening={false}
        name={NodeTags.NO_SELECT}
        fill={undefined}
        strokeEnabled={false}
        stroke="blue"
        strokeWidth={3}
        strokeScaleEnabled={false}
      />
    </>
  );
}
