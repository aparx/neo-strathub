"use client";
import { EDITOR_RENDERERS } from "@/modules/editor/components/viewport";
import { CanvasNode, createCanvasNode } from "@repo/canvas";
import { pascalCase } from "@repo/utils";
import React from "react";
import { IconBaseProps } from "react-icons/lib";
import { PiCircleFill, PiRectangleFill, PiTriangleFill } from "react-icons/pi";
import { useEditorContext } from "../../../../_context";
import * as css from "./shapeList.css";

interface ShapeData {
  symbol: React.FC<IconBaseProps>;
  create: () => CanvasNode;
}

const SHAPES = {
  rectangle: {
    symbol: (props) => <PiRectangleFill {...props} />,
    create: () =>
      createCanvasNode(EDITOR_RENDERERS, "Rectangle", {
        width: 30,
        height: 30,
        fill: "rgba(100, 100, 100, 1)",
      }),
  },
  circle: {
    symbol: (props) => <PiCircleFill {...props} />,
    create: () =>
      createCanvasNode(EDITOR_RENDERERS, "Rectangle", {
        width: 30,
        height: 30,
        fill: "rgba(100, 100, 100, 1)",
      }),
  },
  triangle: {
    symbol: (props) => <PiTriangleFill {...props} />,
    create: () =>
      createCanvasNode(EDITOR_RENDERERS, "Rectangle", {
        width: 30,
        height: 30,
        fill: "rgba(100, 100, 100, 1)",
      }),
  },
} as const satisfies Record<string, ShapeData>;

export function SidepanelShapeList() {
  return (
    <ul className={css.list}>
      {Object.keys(SHAPES).map((key) => (
        <li key={key}>
          <Shape {...SHAPES[key as keyof typeof SHAPES]} name={key} />
        </li>
      ))}
    </ul>
  );
}

function Shape({ name, symbol, create }: ShapeData & { name: string }) {
  const [, updateEditor] = useEditorContext();

  const Symbol = symbol;
  return (
    <div
      className={css.shape}
      draggable
      aria-label={pascalCase(name)}
      onDragStart={() =>
        updateEditor((old) => ({
          ...old,
          dragged: create(),
        }))
      }
    >
      <Symbol />
    </div>
  );
}
