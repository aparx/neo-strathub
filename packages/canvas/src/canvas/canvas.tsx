"use client";
import Konva from "konva";
import { ComponentProps, TouchEvent, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { v4 as uuidv4 } from "uuid";

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

const initialNodes: Konva.RectConfig[] = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

export function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const selectionRef = useRef<Konva.Rect>(null);
  const selection = useRef({
    active: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [elements, setElements] = useState<Konva.NodeConfig[]>(initialNodes);
  const [snapping, setSnapping] = useState(false);

  function deleteElements(ids: string[]) {
    setElements((prev) => prev.filter((x) => !x.id || !ids.includes(x.id)));
    setSelectedIds((prev) => prev.filter((x) => !ids.includes(x)));
  }

  function moveElements(ids: string[], x: number, y: number) {
    layerRef.current!.children.forEach((child) => {
      if (!selectedIds.includes(child.id())) return;
      child.x(child.x() + x);
      child.y(child.y() + y);
    });
    layerRef.current!.batchDraw();
  }

  function duplicateElements(ids: string[]) {
    const duplicateIds = new Array<string>();
    setElements((prev) => {
      const duplicates = prev
        .filter((x) => x.id && ids.includes(x.id))
        .map<Konva.NodeConfig>((target) => {
          const newId = uuidv4();
          duplicateIds.push(newId);
          return {
            ...target,
            id: newId,
            x: target.x + 20,
            y: target.y + 20,
          };
        });
      return [...prev, ...duplicates];
    });
    setSelectedIds(duplicateIds);
  }

  useEffect(() => {
    const nodes = selectedIds
      .map((id) => layerRef.current!.findOne("#" + id))
      .filter((x): x is NonNullable<typeof x> => x != null);
    trRef.current!.nodes(nodes);
    trRef.current!.getLayer()!.batchDraw();
  }, [selectedIds]);

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
    if (!selection.current.active) return;
    const pos = e.target.getStage()!.getPointerPosition()!;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  }

  function onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const isElement = e.target.findAncestor(".elements-container");
    const isTransformer = e.target.findAncestor("Transformer");
    if (isElement || isTransformer) return;
    const pos = e.target.getStage()!.getPointerPosition()!;
    selection.current.x1 = selection.current.x2 = pos.x;
    selection.current.y1 = selection.current.y2 = pos.y;
    if (e.target.id() === stageRef.current!.id())
      selection.current.active = true;
    updateSelectionRect();
  }

  function onMouseUp(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!selection.current.active) return;
    // Find all elements that fall within the selection area and transform them
    const selectedElements = new Array<string>();
    const selectionBox = selectionRef.current!.getClientRect();
    layerRef.current!.children.forEach((child) => {
      if (!child.listening() || selectionRef.current!.id() === child.id())
        return;
      if (Konva.Util.haveIntersection(selectionBox, child.getClientRect()))
        selectedElements.push(child.id());
    });
    setSelectedIds(selectedElements);
    selection.current.active = false;
    updateSelectionRect();
  }

  function onSingleSelect(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    const { x1, y1, x2, y2 } = selection.current;
    if (x1 !== x2 || y1 !== y2)
      // The selection has expanded, thus this is not a single click
      return;

    if (e.target === e.target.getStage())
      // Selected empty space, thus deselect all
      return setSelectedIds([]);

    const targetId = e.target.id();
    const metaPressed = e.evt.ctrlKey || e.evt.shiftKey || e.evt.altKey;
    const selected = selectedIds.includes(targetId);
    if (metaPressed && !selected)
      setSelectedIds((prevIds) => [...prevIds, targetId]);
    else if (metaPressed && selected)
      setSelectedIds((prevIds) => prevIds.filter((x) => x !== targetId));
    else setSelectedIds([targetId]);
  }

  const onHandleKeyPress: ComponentProps<"div">["onKeyDown"] = (e) => {
    e.preventDefault();
    const moveSpeed = e.shiftKey ? 20 : 5;
    setSnapping(e.code === "ShiftLeft");

    switch (e.key) {
      case "Delete":
        deleteElements(selectedIds);
        break;
      case "ArrowLeft":
        moveElements(selectedIds, -moveSpeed, 0);
        break;
      case "ArrowRight":
        moveElements(selectedIds, moveSpeed, 0);
        break;
      case "ArrowUp":
        moveElements(selectedIds, 0, -moveSpeed);
        break;
      case "ArrowDown":
        moveElements(selectedIds, 0, moveSpeed);
        break;
      case "d":
      case "D":
        duplicateElements(selectedIds);
        break;
    }
  };

  const onHandleKeyUp: ComponentProps<"div">["onKeyUp"] = (e) => {
    if (e.code === "ShiftLeft") setSnapping(false);
  };

  return (
    <div tabIndex={1} onKeyDown={onHandleKeyPress} onKeyUp={onHandleKeyUp}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onClick={onSingleSelect}
      >
        <Layer ref={layerRef}>
          {elements.map((rect, index) => (
            <Rectangle
              key={index}
              shapeProps={rect}
              onChange={(newAttribs) => {
                const rects = elements.slice();
                rects[index] = newAttribs;
                setElements(rects);
                // TODO synchronize with server data
              }}
            />
          ))}
          <Transformer
            ref={trRef}
            rotationSnaps={
              snapping ? [0, 45, 90, 135, 180, 225, 270, 315, 360] : null
            }
            anchorCornerRadius={2}
            anchorFill={"white"}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              return newBox.width >= 5 && newBox.height >= 5 ? newBox : oldBox;
            }}
          />
          <Rect listening={false} ref={selectionRef} fill={"red"} />
        </Layer>
      </Stage>
    </div>
  );
}
