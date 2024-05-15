import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import React, { forwardRef, useRef } from "react";
import { Rect } from "react-konva";
import { CanvasRootContext, CanvasRootContextProvider } from "./canvas.context";
import { CanvasData, CanvasNodeData } from "./canvas.data";
import { CanvasLevel } from "./canvas.level";
import { CanvasStage, CanvasStageBaseProps } from "./canvas.stage";
import { CanvasKeyboardHandler } from "./keyboard";
import {
  CanvasObjectRenderer,
  CanvasRendererRegister,
} from "./render/canvasObjectRenderer";
import Vector2d = Konva.Vector2d;

export interface CanvasProps<TNodes extends CanvasNodeData>
  extends CanvasStageBaseProps {
  modifiable?: boolean;
  levelDimensions: Vector2d;
  data: CanvasData<TNodes>;
  /** The children, used for each level, being the render */
  children?: React.ReactNode;
  register: CanvasRendererRegister;
}

const register: CanvasRendererRegister = new Map();
register.set(
  "Rect",
  forwardRef(({ data, modifiable, ...restProps }, ref) => (
    <Rect
      ref={ref as any}
      draggable={modifiable}
      {...data.attrs}
      {...restProps}
    />
  )),
);

export function Canvas<TNode extends CanvasNodeData>({
  modifiable,
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
              <CanvasObjectRenderer
                modifiable={modifiable}
                register={register}
              />
            </CanvasLevel>
          ))}
        </CanvasStage>
      </CanvasKeyboardHandler>
    </CanvasRootContextProvider>
  );
}
