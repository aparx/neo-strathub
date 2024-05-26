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
  isShapeClassNameSupported,
} from "./canvasShapeUtils";

export interface CanvasObjectRendererProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  lookupTable: CanvasRendererLookupTable<TConfig>;
  modifiable?: boolean;
}

interface CanvasObjectBaseProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  data: CanvasNodeData<TConfig>;
  index: number;
  modifiable?: boolean;
}

export interface CanvasObjectProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends CanvasObjectBaseProps<TConfig>,
    KonvaNodeEvents {
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
  modifiable,
  lookupTable,
}: CanvasObjectRendererProps<TConfig>) {
  const level = useCanvasLevel();
  const children = level.children;
  return children.state.map((data, index) => {
    if (!isShapeClassNameSupported(lookupTable, data.className)) {
      // TODO display toast that given canvas is invalid?
      console.error(`Class name '${data.className}' is unsupported`);
      children.update((x) => x.filter((y) => y.className !== data.className));
      return null;
    }
    return (
      <CanvasObject
        key={data.attrs.id}
        data={data}
        index={index}
        modifiable={modifiable}
        renderer={lookupTable[data.className] as CanvasShapeRenderer<any>}
      />
    );
  });
}

/** Component renders the actual node as a canvas object */
function CanvasObject<TConfig extends CanvasNodeConfig>({
  data,
  index,
  modifiable,
  renderer,
}: CanvasObjectBaseProps<TConfig> & {
  renderer: CanvasShapeRenderer<TConfig>;
}) {
  return useMemo(
    () => (
      <ObjectWrapper data={data} index={index}>
        {React.createElement(renderer, { index, modifiable } as any)}
      </ObjectWrapper>
    ),
    [renderer, data, index, modifiable],
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
    level.children.update((oldElements) => {
      const newElements = [...oldElements];
      newElements[index] = {
        ...(oldElements[index] as CanvasNodeData),
        attrs: newConfig as CanvasNodeConfig,
      };
      return newElements;
    });
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
      onDragMove={(e) => {
        // TODO limit object to the level's display
      }}
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
