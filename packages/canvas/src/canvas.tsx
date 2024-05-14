import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import React, { useRef } from "react";
import { CanvasRootContext, CanvasRootContextProvider } from "./canvas.context";
import { CanvasData, CanvasNodeData } from "./canvas.data";
import { CanvasLevel } from "./canvas.level";
import { CanvasStage, CanvasStageBaseProps } from "./canvas.stage";
import { CanvasKeyboardHandler } from "./keyboard";
import { CanvasShapeRenderer } from "./render/canvasShapeRenderer";
import Vector2d = Konva.Vector2d;

export interface CanvasProps<TNodes extends CanvasNodeData>
  extends CanvasStageBaseProps {
  levelDimensions: Vector2d;
  data: CanvasData<TNodes>;
  /** The children, used for each level, being the render */
  children?: React.ReactNode;
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
              <CanvasShapeRenderer />
            </CanvasLevel>
          ))}
        </CanvasStage>
      </CanvasKeyboardHandler>
    </CanvasRootContextProvider>
  );
}
