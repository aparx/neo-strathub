"use client";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import Konva from "konva";
import { TouchEvent, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage } from "react-konva";
import { CanvasContext, CanvasContextProvider } from "./canvas.context";
import { CanvasTransformer } from "./canvas.transformer";
import { CanvasKeyboardHandler } from "./keyboard";
import Vector2d = Konva.Vector2d;

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
        });
      }}
    />
  );
}

export interface Selection {
  active: boolean;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const STARTING_POS: Readonly<Vector2d> = { x: 0, y: 0 } as const;

export function Canvas({
  elements,
  imageBackground,
}: {
  elements: SharedState<Konva.NodeConfig[]>;
  imageBackground: string;
}) {
  const [position, setPosition] = useState<Readonly<Vector2d>>(STARTING_POS);
  const moveCanvas = useRef(false);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const selectionRef = useRef<Konva.Rect>(null);
  const selection = useRef<Selection>({
    active: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const selected = useSharedState<string[]>([]);
  const snapping = useSharedState(false);

  useEffect(() => {
    const nodes = (selected.state as string[])
      .map((id) => layerRef.current!.findOne("#" + id))
      .filter((x): x is NonNullable<typeof x> => x != null);
    trRef.current!.nodes(nodes);
    trRef.current!.getLayer()!.batchDraw();
  }, [selected.state]);

  function updateSelectionRect() {
    selectionRef.current!.setAttrs({
      visible: selection.current!.active,
      x: Math.min(selection.current!.x1, selection.current!.x2),
      y: Math.min(selection.current!.y1, selection.current!.y2),
      width: Math.abs(selection.current!.x1 - selection.current!.x2),
      height: Math.abs(selection.current!.y1 - selection.current!.y2),
      fill: "rgba(0, 150, 255, 0.33)",
      strokeEnabled: true,
      strokeWidth: 1,
      stroke: "rgba(255, 255, 255, .3)",
    } satisfies Konva.RectConfig);
    selectionRef.current!.getLayer()!.batchDraw();
  }

  function onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (selection.current.active) {
      const pos = e.target.getStage()!.getRelativePointerPosition()!;
      selection.current.x2 = pos.x;
      selection.current.y2 = pos.y;
      updateSelectionRect();
    } else if (moveCanvas.current) {
      setPosition((oldPos) => ({
        x: oldPos.x + e.evt.movementX,
        y: oldPos.y + e.evt.movementY,
      }));
    }
  }

  function onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    switch (e.evt.button) {
      case 1 /* MIDDLE_MOUSE_BUTTON */:
        moveCanvas.current = true;
        break;

      case 0 /* LEFT_MOUSE_BUTTON */:
        // Update the selection
        const isElement = e.target.findAncestor(".elements-container");
        const isTransformer = e.target.findAncestor("Transformer");
        if (isElement || isTransformer) return;
        const pos = e.target.getStage()!.getRelativePointerPosition()!;
        selection.current.x1 = selection.current.x2 = pos.x;
        selection.current.y1 = selection.current.y2 = pos.y;
        if (e.target.id() === stageRef.current!.id())
          selection.current.active = true;
        updateSelectionRect();
      // fallthrough
      default:
        moveCanvas.current = false;
    }
  }

  function onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
    if (e.evt.button === 1) moveCanvas.current = false;
    if (!selection.current.active) return;
    if (e.evt.button !== 0) return;
    // Find all elements that fall within the selection area and transform them
    const selectedElementIds = new Array<string>();
    const selectionBox = selectionRef.current!.getClientRect();
    layerRef.current!.children.forEach((child) => {
      const isVisible = child.isVisible();
      const isListening = child.isListening();
      const isSelection = selectionRef.current!.id() === child.id();
      if (!isVisible || !isListening || isSelection) return;
      if (Konva.Util.haveIntersection(selectionBox, child.getClientRect()))
        selectedElementIds.push(child.id());
    });
    selected.update(selectedElementIds);
    selection.current.active = false;
    updateSelectionRect();
  }

  function onSingleSelect(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if ("button" in e.evt && e.evt.button !== 0) return;
    const { x1, y1, x2, y2 } = selection.current;
    if (x1 !== x2 || y1 !== y2)
      // The selection has expanded, thus this is not a single click
      return;

    if (e.target === e.target.getStage())
      // Selected empty space, thus deselect all
      return selected.update([]);

    const targetId = e.target.id();
    const altPressed = e.evt.metaKey || e.evt.shiftKey || e.evt.altKey;
    const isSelected = selected.state.includes(targetId);
    if (altPressed && !isSelected)
      selected.update((prev: string[]) => [...prev, targetId]);
    else if (altPressed && isSelected)
      selected.update((prev: string[]) => prev.filter((x) => x !== targetId));
    else selected.update([targetId]);
  }

  const context = {
    elements,
    selected,
    snapping,
    layer: () => layerRef.current!,
    stage: () => stageRef.current!,
    isSelected: (id) => selected.state.includes(id),
  } satisfies CanvasContext;

  const [imageObj, setImageObj] = useState<HTMLImageElement>();

  useEffect(() => {
    const image = new Image();
    image.src = imageBackground;
    image.onload = () => setImageObj(image);
    return () => setImageObj(undefined);
  }, []);

  return (
    <CanvasContextProvider value={context}>
      <CanvasKeyboardHandler>
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          x={position.x}
          y={position.y}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onClick={onSingleSelect}
        >
          <Layer ref={layerRef}>
            <Rect
              listening={false}
              width={window.innerWidth}
              height={window.innerHeight}
            />
            {imageObj && (
              <KonvaImage
                listening={false}
                scale={{ x: 5, y: 5 }}
                image={imageObj}
                width={imageObj.width}
                height={imageObj.height}
              />
            )}
            {elements.state.map((rect, index) => (
              <Rectangle
                key={index}
                shapeProps={rect}
                onChange={(newAttribs) => {
                  const newElements = elements.state.slice();
                  newElements[index] = newAttribs;
                  elements.update(newElements);
                  // TODO synchronize with server data
                }}
              />
            ))}
            <CanvasTransformer
              ref={trRef}
              snapRotationParts={8 /* 45deg angle */}
            />
            <Rect listening={false} ref={selectionRef} fill={"red"} />
          </Layer>
        </Stage>
      </CanvasKeyboardHandler>
    </CanvasContextProvider>
  );
}
