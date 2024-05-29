import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CanvasRootContext, CanvasRootContextProvider } from "./canvas.context";
import { CanvasData, CanvasLevelNode, CanvasNodeData } from "./canvas.data";
import { CanvasLevel, CanvasLevelEventType } from "./canvas.level";
import {
  CanvasStage,
  CanvasStageBaseProps,
  CanvasStageEvents,
} from "./canvas.stage";
import { CanvasKeyboardHandler } from "./keyboard";
import { CanvasObjectRenderer, CanvasRendererLookupTable } from "./render";
import Vector2d = Konva.Vector2d;

export type CanvasEventHandler<
  TNodeData extends CanvasNodeData = CanvasNodeData,
> = (
  level: CanvasLevelNode,
  type: CanvasLevelEventType,
  nodes: TNodeData[],
) => any;

export interface CanvasEvents<TNodeData extends CanvasNodeData = CanvasNodeData>
  extends CanvasStageEvents {
  onLevelEvent?: CanvasEventHandler<TNodeData>;
}

export interface CanvasProps<TNodeData extends CanvasNodeData = CanvasNodeData>
  extends CanvasStageBaseProps,
    CanvasEvents<TNodeData> {
  data: CanvasData<TNodeData>;
  /** The children, used for each level, being the render */
  children?: React.ReactNode;
  /** Map of custom renderable canvas objects */
  lookupTable: CanvasRendererLookupTable;
  preferences: CanvasPreferences;
}

export interface CanvasPreferences {
  canvasWidth: number;
  canvasHeight: number;
  levelWidth: number;
  levelHeight: number;
  /** Padding of a level canvas around a level image */
  levelPadding: number;
}

export type CanvasRef<TNodeData extends CanvasNodeData = CanvasNodeData> =
  CanvasRootContext<TNodeData>;

export const Canvas = forwardRef<CanvasRef, CanvasProps<any>>(
  function Canvas(props, ref) {
    const {
      editable,
      preferences,
      data,
      children,
      lookupTable,
      onLevelEvent,
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
          <CanvasStage
            ref={stageRef}
            width={preferences.canvasWidth}
            height={preferences.canvasHeight}
            editable={editable}
            {...restProps}
          >
            {data.map((level) => (
              <CanvasLevel
                key={level.id}
                id={level.id}
                level={level}
                width={preferences.levelWidth}
                height={preferences.levelHeight}
                padding={preferences.levelPadding}
                focused={context.focusedLevel.state === level.id}
                onFocus={() => context.focusedLevel.update(level.id)}
                onEvent={(type, nodes) => onLevelEvent?.(level, type, nodes)}
              >
                <CanvasObjectRenderer
                  editable={editable}
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
