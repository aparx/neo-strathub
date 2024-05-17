import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useCanvas } from "./canvas.context";
import { DefaultTransformer } from "./transformers";
import Vector2d = Konva.Vector2d;

export interface CanvasStageBaseProps {
  width: number;
  height: number;
  /** True if elements can be interacted with, thus edited */
  editable?: boolean;
  /** True if the canvas can be moved around, zoomed in, etc. */
  movable?: boolean;
  /** Called when the stage is moved (implicitly or explicitly) */
  onMove?: (newPos: Vector2d) => void;
  /** Called when the zoom changes of the stage (the scale) */
  onZoom?: (scale: number) => void;
}

export interface CanvasStageProps extends CanvasStageBaseProps {
  children?: React.ReactNode;
}

interface SelectionData {
  active: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const CanvasStage = forwardRef<Konva.Stage, CanvasStageProps>(
  function CanvasStage(props, ref) {
    const { children, editable, movable, onMove, onZoom, ...restProps } = props;
    const { selected, isSelected, scale, cursor, position } = useCanvas();
    const stageRef = useRef<Konva.Stage>(null);
    const multiTransformerRef = useRef<Konva.Transformer>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);
    const selectionArea = useRef<SelectionData>({
      active: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    });
    const [dragging, setDragging] = useState(false);

    // Call event handlers passed as props
    useEffect(() => onMove?.(position.state), [position.state]);
    useEffect(() => onZoom?.(scale.state), [scale.state]);

    // Update the cursor when grabbing
    useEffect(() => {
      cursor.update((previousCursor) => {
        if (dragging) return "grabbing";
        else if (previousCursor === "grabbing") return undefined;
        return previousCursor;
      });
    }, [dragging]);

    const updateSelectionRect = useCallback(() => {
      const rect = selectionRectRef.current;
      const area = selectionArea.current;
      if (!rect || !area) return;
      redrawSelectionRect(rect, area);
    }, []);

    useEffect(() => {
      // Update nodes of the transformer to only include the selected
      const nodes = (selected.state as string[])
        .map((id) => stageRef.current!.findOne("#" + id))
        .filter((x): x is NonNullable<typeof x> => x != null);
      multiTransformerRef.current!.nodes(
        selected.state.length > 1 ? nodes : [],
      );
      multiTransformerRef.current!.getLayer()!.batchDraw();
    }, [selected.state]);

    /** Event callback, called whenever a mouse button was pressed on the stage */
    const mouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
      switch (e.evt.button) {
        case 1 /* MIDDLE */:
          if (
            (stageRef.current !== e.target &&
              !e.target.hasName("background")) ||
            !movable
          )
            break;
          setDragging(true);
          break;
        case 0 /* LEFT */:
          if (e.target.findAncestor("Transformer") || !editable) return;
          if (e.target.hasName("Transformer")) return;
          // Restrict the selected area to the just clicked point
          const pos = e.target.getStage()!.getRelativePointerPosition()!;
          selectionArea.current.x1 = selectionArea.current.x2 = pos.x;
          selectionArea.current.y1 = selectionArea.current.y2 = pos.y;
          if (e.target.id() === stageRef.current!.id())
            selectionArea.current.active = true;
          updateSelectionRect();
        // fallthrough
        default:
          setDragging(false);
      }
    }, []);

    /** Event callback, called whenever a mouse button was released on the stage */
    const mouseUp = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
      switch (e.evt.button) {
        case 1 /* MIDDLE */:
          setDragging(false);
          break;
        case 0 /* LEFT */:
          if (!selectionArea.current.active) break;
          // Select all elements within the selected area
          const selectedElementIds = new Array<string>();
          const selectBox = selectionRectRef.current!.getClientRect();
          stageRef.current!.children.forEach((layer) => {
            if (!layer.hasName("level") && !layer.hasName("background")) return;
            layer.children.forEach((node) => {
              const isVisible = node.isVisible();
              const isListening = node.isListening();
              const isSelection = selectionRectRef.current!.id() === node.id();
              if (!isVisible || !isListening || isSelection) return;
              if (Konva.Util.haveIntersection(selectBox, node.getClientRect()))
                selectedElementIds.push(node.id());
            });
          });
          selected.update(selectedElementIds);
          selectionArea.current.active = false;
          updateSelectionRect();
          break;
      }
    }, []);

    /** Event callback, called whenever a mouse was moved within the stage */
    const mouseMove = useCallback(
      (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (selectionArea.current.active) {
          const pos = e.target.getStage()!.getRelativePointerPosition()!;
          selectionArea.current.x2 = pos.x;
          selectionArea.current.y2 = pos.y;
          updateSelectionRect();
        } else if (dragging) {
          position.update((oldPos) => ({
            x: oldPos.x + e.evt.movementX,
            y: oldPos.y + e.evt.movementY,
          }));
        }
      },
      [dragging],
    );

    const mouseClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
      const { x1, y1, x2, y2 } = selectionArea.current;
      if (x1 !== x2 || y1 !== y2)
        // The selection has expanded, thus this is not a single click
        return;

      if (e.target === e.target.getStage() || e.target.hasName("background")) {
        // Selected empty space, thus deselect all
        return selected.update([]);
      }

      const targetId = e.target.id();
      const altPressed = e.evt.metaKey || e.evt.shiftKey || e.evt.altKey;
      const isTargetSelected = isSelected(targetId);
      if (altPressed && !isTargetSelected)
        selected.update((prev: string[]) => [...prev, targetId]);
      else if (altPressed && isTargetSelected)
        selected.update((prev: string[]) => prev.filter((x) => x !== targetId));
      else selected.update([targetId]);
    }, []);

    /** Event callback, called to update the zoom level */
    const wheelUpdate = useCallback(
      (e: KonvaEventObject<WheelEvent>) => {
        if (e.evt.defaultPrevented) return;
        e.evt.preventDefault();
        if (!e.evt.ctrlKey && !e.evt.metaKey) {
          // Scroll in canvas
          const deltaMultiplier = scale.state * (e.evt.altKey ? 0.8 : 0.4);
          const deltaX = e.evt.deltaX * -deltaMultiplier;
          const deltaY = e.evt.deltaY * -deltaMultiplier;

          position.update((oldPos) => ({
            x: oldPos.x + (e.evt.shiftKey ? -deltaY : deltaX),
            y: oldPos.y + (e.evt.shiftKey ? deltaX : deltaY),
          }));
          return;
        }
        // Zoom into the stage
        const pointer = stageRef.current!.getPointerPosition()!;
        const oldScale = stageRef.current!.scaleX();
        const scaleBy = e.evt.altKey ? 1.15 : 1.05;
        const pointTo = {
          x: (pointer.x - stageRef.current!.x()) / oldScale,
          y: (pointer.y - stageRef.current!.y()) / oldScale,
        } satisfies Vector2d;

        let newScale =
          e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        newScale = Math.max(Math.min(newScale, 10), 0.1);
        scale.update(newScale);
        position.update({
          x: pointer.x - pointTo.x * newScale,
          y: pointer.y - pointTo.y * newScale,
        });
      },
      [scale.state],
    );

    return (
      <Stage
        ref={mergeRefs(ref, stageRef)}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onMouseMove={mouseMove}
        onClick={mouseClick}
        onWheel={wheelUpdate}
        scaleX={scale.state}
        scaleY={scale.state}
        x={position.state.x}
        y={position.state.y}
        {...restProps}
      >
        {children}
        <Layer>
          <DefaultTransformer ref={multiTransformerRef} />
          <Rect listening={false} ref={selectionRectRef} />
        </Layer>
      </Stage>
    );
  },
);

function redrawSelectionRect(rect: Konva.Rect, selection: SelectionData) {
  rect.setAttrs({
    visible: selection.active,
    x: Math.min(selection.x1, selection.x2),
    y: Math.min(selection.y1, selection.y2),
    width: Math.abs(selection.x1 - selection.x2),
    height: Math.abs(selection.y1 - selection.y2),
    fill: "rgba(0, 150, 255, 0.33)",
    strokeEnabled: true,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    stroke: "rgba(255, 255, 255, .3)",
  } satisfies Konva.RectConfig);
  rect.getLayer()?.batchDraw();
}
