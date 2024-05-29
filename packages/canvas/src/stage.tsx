import Konva from "konva";
import React from "react";
import * as ReactKonva from "react-konva";

export interface CanvasStageProps extends Konva.LayerConfig {
  children: React.ReactNode;
  width: number;
  height: number;
}

export function CanvasStage(props: CanvasStageProps) {
  return <ReactKonva.Layer {...props} />;
}
