import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasContext, CanvasContextProvider } from "./context/canvasContext";
import { CanvasLevel } from "./level";
import { CanvasData, MouseButton, NodeTags } from "./utils";

// 1. Canvas
//   1. Stage (Layer)
//   2. Level (Group)

export interface CanvasPreferences {
  width: number;
  height: number;
}

export interface CanvasProps {
  preferences: CanvasPreferences;
  data: CanvasData;
}

interface SelectionArea {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  active: boolean;
}

const EMPTY_SELECTION_AREA = {
  x0: 0,
  x1: 0,
  y0: 0,
  y1: 0,
  active: false,
} as const satisfies SelectionArea;

/**
 * The canvas is the root element, containing different stages, that
 * themselves are layers of the canvas. It is handling all specific
 * things, such as keyboard input, movement, selection, and more.
 */
export function Canvas({ preferences, data }: CanvasProps) {
  const context = {
    position: useSharedState({ x: 0, y: 0 }),
    scale: useSharedState(1),
    cursor: useSharedState(),
    selected: useSharedState(),
  } satisfies CanvasContext;

  const moveDragRef = useRef(false);
  const selectionRef = useRef<Konva.Rect>(null);
  const selectionAreaRef = useRef<SelectionArea>(EMPTY_SELECTION_AREA);
  const stageRef = useRef<Konva.Stage>(null);

  function redrawSelection() {
    const area = selectionAreaRef.current;
    const selection = selectionRef.current;
    if (!selection || !area) return;
    selection.visible(area.active);
    const minX = Math.min(area.x0, area.x1);
    const maxX = Math.max(area.x0, area.x1);
    const minY = Math.min(area.y0, area.y1);
    const maxY = Math.max(area.y0, area.y1);
    selection.width(maxX - minX);
    selection.height(maxY - minY);
    selection.x(minX);
    selection.y(minY);
  }

  function mouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.currentTarget !== stageRef.current) return;
    if (moveDragRef.current) {
      // Track mouse movement for canvas
      context.position.update((pos) => ({
        x: pos.x + e.evt.movementX,
        y: pos.y + e.evt.movementY,
      }));
    } else if (selectionAreaRef.current.active) {
      // Change size of selection
      const stage = stageRef.current;
      const pointer = stage.getRelativePointerPosition();
      if (!pointer) return;
      selectionAreaRef.current.x1 = pointer.x;
      selectionAreaRef.current.y1 = pointer.y;
      redrawSelection();
    }
  }

  function mouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
    if (moveDragRef.current) {
      // Disable canvas movement
      context.cursor.update(undefined);
      moveDragRef.current = false;
    }
    if (selectionAreaRef.current.active) {
      // Select elements
      const area = selectionAreaRef.current;
      const stage = stageRef.current;
      const selected = new Array<string>();
      stage?.children.forEach((layer) => {
        const selection = selectionRef.current;
        if (layer.hasName(NodeTags.NO_SELECT) || !selection) return;
        const box = selection.getClientRect();
        layer.children
          .filter((x) => isNodeSelectable(x) && x !== selection)
          .filter((x) => Konva.Util.haveIntersection(x.getClientRect(), box))
          .forEach((node) => selected.push(node.id()));
      });
      context.selected.update(selected);
      area.active = false;
      redrawSelection();
    }
  }

  function isNodeSelectable(node: Konva.Node) {
    return node.isVisible() && !node.hasName(NodeTags.NO_SELECT);
  }

  function mouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.currentTarget !== stageRef.current) return;
    const stage = stageRef.current;
    const pointer = stage?.getRelativePointerPosition();
    if (!stage || !pointer) return;
    switch (e.evt.button) {
      /** Begin selection */
      case MouseButton.LEFT:
        e.evt.preventDefault();
        const area = selectionAreaRef.current;
        area.x0 = area.x1 = pointer.x;
        area.y0 = area.y1 = pointer.y;
        area.active = true;
        redrawSelection();
        break;
      /** Enable canvas movement */
      case MouseButton.MIDDLE:
        e.evt.preventDefault();
        context.cursor.update("grabbing");
        moveDragRef.current = true;
      // fallthrough
      default:
        if (selectionAreaRef.current.active) {
          selectionAreaRef.current.active = false;
          redrawSelection();
        }
    }
  }

  function wheelScroll(e: Konva.KonvaEventObject<WheelEvent>) {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer || !stage) return;
    if (!e.evt.ctrlKey && !e.evt.metaKey) {
      // Scroll in canvas
      const multiplier = context.scale.state * (e.evt.altKey ? 0.8 : 0.4);
      context.position.update((oldPos) => ({
        x: oldPos.x - e.evt.deltaX * multiplier,
        y: oldPos.y - e.evt.deltaY * multiplier,
      }));
      return;
    }
    // Zoom into the canvas
    context.scale.update((oldScale) => {
      const scaleBy = e.evt.altKey ? 1.15 : 1.05;
      const pointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      } satisfies Konva.Vector2d;
      let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.min(10, Math.max(newScale, 0.1));
      context.position.update({
        x: pointer.x - pointTo.x * newScale,
        y: pointer.y - pointTo.y * newScale,
      });
      return newScale;
    });
  }

  return (
    <div style={{ cursor: context.cursor.state }}>
      <CanvasContextProvider value={context}>
        <ReactKonva.Stage
          ref={stageRef}
          width={preferences.width}
          height={preferences.height}
          x={context.position.state.x}
          y={context.position.state.y}
          scaleX={context.scale.state}
          scaleY={context.scale.state}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseUp}
          onWheel={wheelScroll}
        >
          <ReactKonva.Layer>
            {data.map((level) => (
              <CanvasLevel
                {...level.data}
                style={{
                  width: 1200,
                  height: 800,
                  padding: 40,
                  background: "rgb(230, 230, 230)",
                }}
              >
                <ReactKonva.Rect x={0} width={100} height={100} fill="red" />
              </CanvasLevel>
            ))}
          </ReactKonva.Layer>
          <ReactKonva.Layer>
            <ReactKonva.Rect
              ref={selectionRef}
              fill="rgba(93, 150, 240, .5)"
              stroke="rgba(255, 255, 255, .3)"
              strokeScaleEnabled={false}
              strokeWidth={1}
              strokeEnabled
            />
          </ReactKonva.Layer>
        </ReactKonva.Stage>
      </CanvasContextProvider>
    </div>
  );
}
