import { Slot } from "@radix-ui/react-slot";
import Konva from "konva";
import { FC, ReactElement, useRef } from "react";
import { Rect } from "react-konva";
import { useCanvasLevel } from "../canvas.context";
import { BaseNodeConfig, CanvasNodeData } from "../canvas.data";

const elementsByClassName = {
  Rect: (props) => <Rectangle {...props} />,
} as Record<string, FC<ShapeProps>>;

export function CanvasShapeRenderer() {
  const level = useCanvasLevel();
  return level.children.state.map((child, index) => {
    return (
      <ShapeWrapper key={child.attrs.id} node={child} index={index}>
        {elementsByClassName[child.className]?.({ node: child, index })}
      </ShapeWrapper>
    );
  });
}

interface ShapeProps extends CanvasNodeData {
  onChange: (newConfig: BaseNodeConfig) => any;
}

function ShapeWrapper({
  index,
  children,
  node,
}: {
  node: CanvasNodeData;
  index: number;
  children: ReactElement<ShapeProps>;
}) {
  const level = useCanvasLevel();
  return (
    <Slot
      {...node}
      onChange={(newConfig) => {
        level.children.update((oldElements) => {
          const newElements = [...oldElements];
          newElements[index] = {
            ...(oldElements[index] as CanvasNodeData),
            attrs: newConfig as BaseNodeConfig,
          };
          return newElements;
        });
      }}
    >
      {children}
    </Slot>
  );
}

function Rectangle({ onChange, attrs }: ShapeProps) {
  const ref = useRef<Konva.Rect>(null);
  return (
    <Rect
      ref={ref}
      {...attrs}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...attrs,
          x: e.target.x(),
          y: e.target.y(),
          rotation: e.target.rotation(),
        });
      }}
      onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = e.target!;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...attrs,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
          rotation: e.target.rotation(),
        });
      }}
    />
  );
}
