import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CanvasRootContext, CanvasRootContextProvider } from "./canvas.context";
import { CanvasData, CanvasNodeData } from "./canvas.data";
import { CanvasLevel } from "./canvas.level";
import { CanvasStage, CanvasStageBaseProps } from "./canvas.stage";
import { CanvasKeyboardHandler } from "./keyboard";
import { CanvasObjectRenderer, CanvasRendererLookupTable } from "./render";
import Vector2d = Konva.Vector2d;

export interface CanvasProps<TNodes extends CanvasNodeData = CanvasNodeData>
  extends CanvasStageBaseProps {
  modifiable?: boolean;
  levelDimensions: Vector2d;
  data: CanvasData<TNodes>;
  /** The children, used for each level, being the render */
  children?: React.ReactNode;
  /** Map of custom renderable canvas objects */
  lookupTable: CanvasRendererLookupTable;
}

export type CanvasRef<TNode extends CanvasNodeData = CanvasNodeData> =
  CanvasRootContext<TNode>;

export const Canvas = forwardRef<CanvasRef, CanvasProps>(
  function Canvas(props, ref) {
    const {
      modifiable,
      levelDimensions,
      data,
      children,
      lookupTable,
      ...restProps
    } = props;

    const stageRef = useRef<Konva.Stage>(null);
    const selected = useSharedState(new Array<string>());

    const context = {
      selected,
      data: data,
      cursor: useSharedState(),
      scale: useSharedState(1),
      snapping: useSharedState(false),
      position: useSharedState({ x: 0, y: 0 }),
      focusedLevel: useSharedState(),
      stage: () => stageRef.current!,
      isSelected: (id) => selected.state.includes(id),
    } satisfies CanvasRootContext;

    useImperativeHandle(ref, () => context, [data, selected]);

    return (
      <CanvasRootContextProvider value={context}>
        <CanvasKeyboardHandler style={{ cursor: context.cursor.state }}>
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
                  lookupTable={lookupTable}
                />
              </CanvasLevel>
            ))}
          </CanvasStage>
        </CanvasKeyboardHandler>
      </CanvasRootContextProvider>
    );
  },
);
