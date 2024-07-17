"use client";
import { Nullish } from "@repo/utils";
import Konva from "konva";
import { createContext, useContext } from "react";
import { Html, Portal } from "react-konva-utils";
import { useCanvas } from "../../context";
import { CanvasNodeConfig } from "../../utils";
import * as css from "./transformerContainer.css";

interface RootContext {
  config: CanvasNodeConfig;
  linked: Konva.Node | Nullish;
}

const context = createContext<RootContext | null>(null);

export function useTransformerContainer() {
  const ctx = useContext(context);
  if (!ctx) throw new Error("Missing RootContext");
  return ctx;
}

export function Root({
  children,
  ...restContext
}: RootContext & Readonly<{ children: React.ReactNode }>) {
  return (
    <context.Provider value={restContext}>
      <Portal selector=".selection-layer">{children}</Portal>
    </context.Provider>
  );
}

export function Overlay({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const container = useTransformerContainer();

  const canvas = useCanvas();
  const parent = container.linked?.parent;
  if (!container.linked || !parent) return null;

  const linkRect = container.linked.getClientRect({
    relativeTo: parent,
  });

  const posX = linkRect.x + parent.x();
  const posY = linkRect.y + parent.y();
  const inverseScale = 1 / canvas.scale.state;

  return (
    <Html
      divProps={{
        style: {
          position: "absolute",
          left: 0,
          bottom: 0,
        },
      }}
    >
      <div
        className={css.wrapper}
        style={{
          left: `max(calc(${posX}px + ${linkRect.width / 2}px), 0px)`,
          top: posY - (css.OVERLAY_HEIGHT + 7) * inverseScale,
          scale: inverseScale,
          transform: "translateX(-50%)",
        }}
      >
        <div className={css.overlay}>
          <context.Provider value={container}>{children}</context.Provider>
          <div className={css.arrow} />
        </div>
      </div>
    </Html>
  );
}
