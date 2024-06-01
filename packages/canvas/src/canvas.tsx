import { useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { useRef } from "react";
import * as ReactKonva from "react-konva";
import {
  CanvasContext,
  CanvasContextProvider,
  CanvasUserModifyStatus,
} from "./context/canvasContext";
import { MouseButton, NodeTags } from "./utils";

export interface CanvasStyle {
  width: number;
  height: number;
  selectionColor: string;
}

export interface CanvasEvents {
  onMove?: (position: Konva.Vector2d) => void;
  onZoom?: (scale: number) => void;
}

export interface CanvasProps extends CanvasEvents, CanvasUserModifyStatus {
  children?: React.ReactNode;
  style: CanvasStyle;
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
export function Canvas({
  style,
  children,
  onMove,
  onZoom,
  editable,
  movable,
  selectable,
  zoomable,
}: CanvasProps) {
  const context = {
    position: useSharedState({ x: 0, y: 0 }),
    scale: useSharedState(1),
    cursor: useSharedState(),
    selected: useSharedState<string[]>([]),
    editable,
    movable,
    selectable,
    zoomable,
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
    if (moveDragRef.current) {
      // Track mouse movement for canvas
      context.position.update((oldPos) => {
        const newPos = {
          x: oldPos.x + e.evt.movementX,
          y: oldPos.y + e.evt.movementY,
        };
        onMove?.(newPos);
        return newPos;
      });
    } else if (selectionAreaRef.current.active) {
      // Change size of selections
      const stage = stageRef.current;
      const pointer = stage?.getRelativePointerPosition();
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
    } else if (selectionAreaRef.current.active) {
      // Select elements
      const area = selectionAreaRef.current;
      const stage = stageRef.current;
      const selected = new Array<string>();
      const selection = selectionRef.current;
      selection &&
        stage?.children.forEach((layer) => {
          if (layer.hasName(NodeTags.NO_SELECT)) return;
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
    return node.isVisible() && !node.hasName(NodeTags.NO_SELECT) && !!node.id();
  }

  function mouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const stage = stageRef.current;
    const pointer = stage?.getRelativePointerPosition();
    if (!stage || !pointer) return;
    switch (e.evt.button) {
      /** Begin selection */
      case MouseButton.LEFT:
        if (e.target.findAncestor("Transformer") || !editable) break;
        e.evt.preventDefault();
        const area = selectionAreaRef.current;
        area.x0 = area.x1 = pointer.x;
        area.y0 = area.y1 = pointer.y;
        area.active = stage === e.target;
        redrawSelection();
        break;
      /** Enable canvas movement */
      case MouseButton.MIDDLE:
        if (!movable || e.target !== stageRef.current) break;
        e.evt.preventDefault();
        context.cursor.update("grabbing");
        moveDragRef.current = true;
      // fallthrough
      default:
        if (!selectionAreaRef.current.active) break;
        selectionAreaRef.current.active = false;
        redrawSelection();
    }
  }

  function click(e: Konva.KonvaEventObject<MouseEvent>) {
    if (moveDragRef.current) return; // Don't do anything on move

    if (e.target === stageRef.current || e.target.hasName(NodeTags.NO_SELECT))
      return context.selected.update([]);

    const id = e.target.id();
    const isAltPressed = e.evt.metaKey || e.evt.shiftKey || e.evt.altKey;
    const isSelected = context.selected.state.find((x) => x === id);
    if (isAltPressed && !isSelected) {
      context.selected.update((prev) => [...prev, id]);
    } else if (isAltPressed) {
      context.selected.update((prev) => prev.filter((x) => x !== id));
    } else if (!isSelected) {
      context.selected.update([id]);
    }
  }

  function wheelScroll(e: Konva.KonvaEventObject<WheelEvent>) {
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer || !stage) return;
    if (!e.evt.ctrlKey && !e.evt.metaKey) {
      if (!movable) return;
      // Scroll in canvas
      const multiplier = context.scale.state * (e.evt.altKey ? 0.8 : 0.4);
      context.position.update((oldPos) => ({
        x: oldPos.x - e.evt.deltaX * multiplier,
        y: oldPos.y - e.evt.deltaY * multiplier,
      }));
      return;
    }
    if (!zoomable) return;
    // Zoom into the canvas
    context.scale.update((oldScale) => {
      const scaleBy = e.evt.altKey ? 1.15 : 1.05;
      const pointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      } satisfies Konva.Vector2d;
      let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      newScale = Math.min(10, Math.max(newScale, 0.1));
      onZoom?.(newScale);
      const newPos = {
        x: pointer.x - pointTo.x * newScale,
        y: pointer.y - pointTo.y * newScale,
      };
      onMove?.(newPos);
      context.position.update(newPos);
      return newScale;
    });
  }

  return (
    <CanvasContextProvider value={context}>
      <div style={{ cursor: context.cursor.state }}>
        <ReactKonva.Stage
          ref={stageRef}
          width={style.width}
          height={style.height}
          x={context.position.state.x}
          y={context.position.state.y}
          scaleX={context.scale.state}
          scaleY={context.scale.state}
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onClick={click}
          onMouseLeave={mouseUp}
          onWheel={wheelScroll}
        >
          {children}
          <ReactKonva.Layer>
            <ReactKonva.Rect
              ref={selectionRef}
              fill={style.selectionColor}
              stroke="rgba(255, 255, 255, .3)"
              strokeScaleEnabled={false}
              strokeWidth={1}
              strokeEnabled
            />
          </ReactKonva.Layer>
        </ReactKonva.Stage>
      </div>
    </CanvasContextProvider>
  );
}
