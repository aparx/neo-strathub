import { Slot } from "@radix-ui/react-slot";
import Konva from "konva";
import React, { FC, useMemo } from "react";
import { KonvaNodeEvents } from "react-konva/ReactKonvaCore";
import { useCanvasLevel } from "../canvas.context";
import { BaseNodeConfig, CanvasNodeData } from "../canvas.data";

type ObjectDeepRendererFn = FC<CanvasObjectProps>;

export type CanvasObjectRegister = Map<string, ObjectDeepRendererFn>;

export interface CanvasObjectRendererProps {
  register: CanvasObjectRegister;
  modifiable?: boolean;
}

interface BaseObjectProps {
  node: CanvasNodeData;
  index: number;
  modifiable?: boolean;
}

export interface CanvasObjectProps extends BaseObjectProps, KonvaNodeEvents {
  onChange: (newConfig: BaseNodeConfig) => any;
}

interface ObjectWrapperProps extends Omit<BaseObjectProps, "modifiable"> {
  children: React.ReactNode;
}

export function CanvasObjectRenderer({
  modifiable,
  register,
}: CanvasObjectRendererProps) {
  const level = useCanvasLevel();
  const children = level.children;
  return children.state.map((node, index) => {
    const renderer = register.get(node.className);
    if (!renderer) {
      // TODO display toast that given canvas is invalid?
      console.error(`Missing renderer for class ${node.className}`);
      children.update((x) => x.filter((y) => y.className !== node.className));
      return null;
    }
    return (
      <CanvasObject
        node={node}
        index={index}
        modifiable={modifiable}
        renderer={renderer}
      />
    );
  });
}

/** Component renders the actual node as a canvas object */
function CanvasObject({
  node,
  index,
  modifiable,
  renderer,
}: BaseObjectProps & {
  renderer: ObjectDeepRendererFn;
}) {
  return useMemo(
    () => (
      <ObjectWrapper key={node.attrs.id} node={node} index={index}>
        {React.createElement(renderer, { ...node, index, modifiable } as any)}
      </ObjectWrapper>
    ),
    [renderer, node, index, modifiable],
  );
}

/** Additional component that wraps around an object directly, to apply events */
function ObjectWrapper({ node, index, children }: ObjectWrapperProps) {
  const level = useCanvasLevel();

  function onChange(newConfig: BaseNodeConfig) {
    level.children.update((oldElements) => {
      const newElements = [...oldElements];
      newElements[index] = {
        ...(oldElements[index] as CanvasNodeData),
        attrs: newConfig as BaseNodeConfig,
      };
      return newElements;
    });
  }

  const OnChild = Slot as any as FC<
    CanvasObjectProps & Pick<ObjectWrapperProps, "children">
  >;

  return (
    <OnChild
      node={node}
      index={index}
      onChange={onChange}
      onDragEnd={(e) => {
        onChange({
          ...node.attrs,
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
