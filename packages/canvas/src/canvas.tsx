import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import React, { useRef } from "react";
import { Rect } from "react-konva";
import {
  CanvasRootContext,
  CanvasRootContextProvider,
  useCanvasLevel,
} from "./canvas.context";
import { BaseNodeConfig, CanvasData, CanvasNodeData } from "./canvas.data";
import { CanvasLevel } from "./canvas.level";
import { CanvasStage, CanvasStageBaseProps } from "./canvas.stage";
import { CanvasKeyboardHandler } from "./keyboard";
import Vector2d = Konva.Vector2d;

export interface CanvasProps<TNodes extends CanvasNodeData>
  extends CanvasStageBaseProps {
  levelDimensions: Vector2d;
  data: CanvasData<TNodes>;
  /** The children, used for each level, being the renderer */
  children?: React.ReactNode;
}

function Rectangle({
  shapeProps,
  onChange,
}: {
  shapeProps: Konva.RectConfig;
  onChange: (data: Konva.RectConfig) => any;
}) {
  const shapeRef = useRef<Konva.Rect>(null);

  return (
    <Rect
      ref={shapeRef}
      {...shapeProps}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...shapeProps,
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
        const node = shapeRef.current!;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...shapeProps,
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

function ExampleShape({
  index,
  ...shapeProps
}: Konva.NodeConfig & {
  index: number;
}) {
  const level = useCanvasLevel();

  return (
    <Rectangle
      shapeProps={shapeProps}
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
    />
  );
}

export function Canvas<TNode extends CanvasNodeData>({
  levelDimensions,
  data,
  children,
  ...restProps
}: CanvasProps<TNode>) {
  const stageRef = useRef<Konva.Stage>(null);
  const selected = useSharedState(new Array<string>());

  const context = {
    selected,
    snapping: useSharedState(false),
    focusedLevel: useSharedState(),
    stage: () => stageRef.current!,
    data: data,
    isSelected: (id) => selected.state.includes(id),
  } satisfies CanvasRootContext<TNode>;

  return (
    <CanvasRootContextProvider value={context}>
      <CanvasKeyboardHandler>
        <CanvasStage ref={stageRef} {...restProps}>
          {data.map((level) => (
            <CanvasLevel
              key={level.id}
              id={level.id}
              width={levelDimensions.x}
              height={levelDimensions.y}
              level={level}
              focused={context.focusedLevel.state === level.id}
              onFocus={() => context.focusedLevel.update(level.id)}
              onBlur={() => context.focusedLevel.update(undefined)}
            >
              {level.map((node, index) => (
                <ExampleShape index={index} {...node.attrs} />
              ))}
            </CanvasLevel>
          ))}
        </CanvasStage>
      </CanvasKeyboardHandler>
    </CanvasRootContextProvider>
  );
}
