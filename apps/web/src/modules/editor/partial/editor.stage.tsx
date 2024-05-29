"use client";
import {
  Canvas,
  CanvasData,
  CanvasEvents,
  CanvasLevelNode,
  CanvasNodeData,
  CanvasPreferences,
  CanvasRef,
  CanvasRendererLookupTable,
  CanvasStageBaseProps,
} from "@repo/canvas";
import { nonNull } from "@repo/utils";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import {
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

export interface EditorStageProps<
  TNodeData extends CanvasNodeData = CanvasNodeData,
> extends CanvasStageBaseProps,
    CanvasEvents<TNodeData> {
  preferences: EditorStagePreferences;
  renderers: CanvasRendererLookupTable;
  stage: EditorStageData<TNodeData>;
}

export interface EditorStageData<
  TNodeData extends CanvasNodeData = CanvasNodeData,
> {
  id: number;
  levels: EditorStageLevel<TNodeData>[];
}

export interface EditorStageLevel<
  TNodeData extends CanvasNodeData = CanvasNodeData,
> {
  id: number;
  image: string;
  nodes: TNodeData[];
}

export interface EditorStagePreferences extends CanvasPreferences {
  levelGap: number;
  levelPosMultipliers: [x: number, y: number];
}

type LevelNodesStateRecord = Record<number, SharedState<CanvasNodeData[]>>;

/**
 * Component abstraction of `Canvas`, that acts as a layer between the actual
 * editor and the underlying canvas. It does NOT fetch any data, that must be
 * supplied from the outside. Any mutation that is done locally, is given the
 * event handling function `onLevelEvent`.
 */
export const EditorStage = forwardRef<CanvasRef, EditorStageProps>(
  function EditorStage(props, ref) {
    const { stage, preferences, renderers, ...restProps } = props;
    const state = useSharedState<LevelNodesStateRecord>({});
    const stateRef = useRef(state);
    stateRef.current = state;

    /** Function that updates the nodes for level with given `id` */
    const updateLevel = useCallback(
      (id: number, value: SetStateAction<CanvasNodeData[]>) => {
        stateRef.current?.update((oldState) => {
          const newState = { ...oldState };
          const oldData = newState[id]?.state ?? [];
          const newData = typeof value === "function" ? value(oldData) : value;
          newState[id] = {
            state: newData,
            update: (value) => updateLevel(id, value),
          };
          return newState;
        });
      },
      [],
    );

    // Update the initial (or update to the latest) levels of current stage
    useEffect(() => {
      const newObject = {} as LevelNodesStateRecord;
      stage.levels.forEach((level) => {
        newObject[level.id] = {
          state: level.nodes,
          update: (value) => updateLevel(level.id, value),
        };
      });
      stateRef.current?.update(newObject);
    }, [stage.levels]);

    /** This function creates a position for a level, based on given index */
    const createLevelPosition = useCallback(
      (index: number) => {
        const [dx, dy] = preferences.levelPosMultipliers;
        const gap = preferences.levelGap;
        return {
          x: index * dx * (preferences.levelWidth + gap),
          y: index * dy * (preferences.levelHeight + gap),
        };
      },
      [JSON.stringify(preferences)],
    );

    const data = useMemo(
      () =>
        new CanvasData(
          stage.levels
            .map((level, index) => {
              const children = state.state[level.id];
              if (!children) return null;
              return new CanvasLevelNode(
                level.id,
                level.image,
                createLevelPosition(index),
                children,
              );
            })
            .filter(nonNull),
        ),
      [stage.levels, state, createLevelPosition],
    );

    return (
      <Canvas
        ref={ref}
        data={data}
        preferences={preferences}
        lookupTable={renderers}
        {...restProps}
      />
    );
  },
);
