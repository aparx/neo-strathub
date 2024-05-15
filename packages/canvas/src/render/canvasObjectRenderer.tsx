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

type ObjectDeepRendererFn = React.ForwardRefExoticComponent<
  CanvasObjectProps & RefAttributes<Konva.Node>
>;

export type CanvasRendererRegister = Map<string, ObjectDeepRendererFn>;

export interface CanvasObjectRendererProps {
  register: CanvasRendererRegister;
  modifiable?: boolean;
}

interface BaseObjectProps<TConfig extends CanvasNodeConfig = CanvasNodeConfig> {
  data: CanvasNodeData<TConfig>;
  index: number;
  modifiable?: boolean;
}

export interface CanvasObjectProps<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> extends BaseObjectProps<TConfig>,
    KonvaNodeEvents {
  onChange: (newConfig: TConfig) => any;
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
  return children.state.map((data, index) => {
    const renderer = register.get(data.className);
    if (!renderer) {
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
        renderer={renderer}
      />
    );
  });
}

/** Component renders the actual node as a canvas object */
function CanvasObject({
  data,
  index,
  modifiable,
  renderer,
}: BaseObjectProps & {
  renderer: ObjectDeepRendererFn;
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
function ObjectWrapper({ data, index, children }: ObjectWrapperProps) {
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
