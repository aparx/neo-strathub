import { Slot } from "@radix-ui/react-slot";
import Konva from "konva";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useMemo,
  useRef,
} from "react";
import { KonvaNodeEvents } from "react-konva";
import { useCanvasLevel } from "../canvas.context";
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
      console.error(`Missing renderer for class ${data.className}`);
      children.update((x) => x.filter((y) => y.className !== data.className));
      return null;
    }
    return (
      <CanvasObject
        key={data.attrs.id}
        data={data}
        index={index}
        modifiable={modifiable}
        renderer={lookupTable[data.className]}
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
  renderer: CanvasShapeRenderer;
}) {
  return useMemo(
    () => (
      <ObjectWrapper data={data} index={index}>
        {React.createElement(renderer, { ...data, index, modifiable } as any)}
      </ObjectWrapper>
    ),
    [renderer, data, index, modifiable],
  );
}

/** Additional component that wraps around an object directly, to apply events */
function ObjectWrapper<TConfig extends CanvasNodeData>({
  data,
  index,
  children,
}: ObjectWrapperProps<TConfig>) {
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

  const OnChild = Slot as any as ForwardRefExoticComponent<
    CanvasObjectProps &
      Pick<ObjectWrapperProps, "children"> &
      RefAttributes<Konva.Node>
  >;

  return (
    <OnChild
      ref={childRef}
      data={data}
      index={index}
      onChange={onChange}
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
      onTransformEnd={(e) => {
        const node = e.target as Konva.Node;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...node.attrs,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
          rotation: e.target.rotation(),
        });
      }}
    >
      {children}
    </OnChild>
  );
}
