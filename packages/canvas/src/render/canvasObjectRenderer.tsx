import { Slot } from "@radix-ui/react-slot";
import Konva from "konva";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useMemo,
  useRef,
} from "react";
import { KonvaNodeEvents } from "react-konva";
import { useCanvas, useCanvasLevel } from "../canvas.context";
import { CanvasNodeConfig, CanvasNodeData } from "../canvas.data";
import {
  CanvasRendererLookupTable,
  CanvasShapeRenderer,
  isShapeIdSupported,
} from "./canvasShapeUtils";

export interface CanvasObjectRendererProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  lookupTable: CanvasRendererLookupTable<TConfig>;
  editable?: boolean;
}

interface CanvasObjectBaseProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  data: CanvasNodeData<TConfig>;
  index: number;
  editable?: boolean;
}

export interface CanvasObjectProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends CanvasObjectBaseProps<TConfig>,
    KonvaNodeEvents {
  /** Function that updates this object in the state (and thus also on the server) */
  onChange: (newConfig: TConfig) => any;
  /** Boolean flag that is true, when the individual transformer of a canvas object
   *  should be used (is only true, when the object is actually selected) */
  useSingleTransformer: boolean;
}

interface ObjectWrapperProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends Omit<CanvasObjectBaseProps<TConfig>, "modifiable"> {
  children: React.ReactNode;
}

export function CanvasObjectRenderer<TConfig extends CanvasNodeConfig>({
  editable,
  lookupTable,
}: CanvasObjectRendererProps<TConfig>) {
  const level = useCanvasLevel();
  const children = level.children;
  return children.state.map((data, index) => {
    if (!isShapeIdSupported(lookupTable, data.className)) {
      // TODO display toast that given canvas is invalid?
      const className = data.className;
      console.error(`Shape className '${className}' is unsupported`);
      children.update((prev) => prev.filter((x) => x.className !== className));
      return null;
    }
    return (
      <CanvasObject
        key={data.attrs.id}
        data={data}
        index={index}
        editable={editable}
        renderer={lookupTable[data.className] as CanvasShapeRenderer<any>}
      />
    );
  });
}

/** Component renders the actual node as a canvas object */
function CanvasObject<TConfig extends CanvasNodeConfig>({
  data,
  index,
  editable,
  renderer,
}: CanvasObjectBaseProps<TConfig> & {
  renderer: CanvasShapeRenderer<TConfig>;
}) {
  return useMemo(
    () => (
      <ObjectWrapper data={data} index={index}>
        {React.createElement(renderer, { index, editable } as any)}
      </ObjectWrapper>
    ),
    [renderer, data, index, editable],
  );
}

/** Additional component that wraps around an object directly, to apply events */
function ObjectWrapper<TConfig extends CanvasNodeConfig>({
  data,
  index,
  children,
}: ObjectWrapperProps<TConfig>) {
  const ctx = useCanvas();
  const level = useCanvasLevel();
  const childRef = useRef<Konva.Node>(null);

  function onChange(newConfig: CanvasNodeConfig) {
    const oldNodes = level.children.state;
    const node = oldNodes[index] as CanvasNodeData;
    const newNode = {
      ...node,
      attrs: newConfig,
    } satisfies CanvasNodeData;
    ctx.emit("update", level, newNode);
    const newNodes = [...oldNodes];
    newNodes[index] = newNode;
    level.children.update(newNodes);
  }

  const ShapeChild = Slot as any as ForwardRefExoticComponent<
    CanvasObjectProps &
      Pick<ObjectWrapperProps, "children"> &
      RefAttributes<Konva.Node>
  >;

  return (
    <ShapeChild
      ref={childRef}
      data={data}
      index={index}
      onChange={onChange}
      useSingleTransformer={
        ctx.selected.state.length === 1 &&
        ctx.selected.state[0] === data.attrs.id
      }
      onDragEnd={(e) => {
        onChange({
          ...data.attrs,
          x: e.target.x(),
          y: e.target.y(),
          rotation: e.target.rotation(),
        });
      }}
    >
      {children}
    </ShapeChild>
  );
}
