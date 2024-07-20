import { CanvasNodeConfig } from "@repo/canvas";
import Konva from "konva";

//* Refactored this code from:
//* https://github.com/konvajs/react-konva/issues/628#issuecomment-966493892

export function getCenter(shape: CanvasNodeConfig) {
  const { x = 0, y = 0, width = 0, height = 0 } = shape;
  const angleRad = Konva.Util.degToRad(shape.rotation || 0);
  const cos = Math.cos(angleRad);

  return {
    x: x + width * 0.5 * cos + height * 0.5 * Math.sin(-angleRad),
    y: y + height * 0.5 * cos + width * 0.5 * Math.sin(angleRad),
  };
}

export function rotateAroundPoint(
  shape: CanvasNodeConfig,
  deltaDeg: number,
  point: Konva.Vector2d,
) {
  const { x = 0, y = 0 } = shape;
  const angleRad = Konva.Util.degToRad(deltaDeg);
  const sin = Math.sin(angleRad);
  const cos = Math.cos(angleRad);

  return {
    rotation: Math.round((shape.rotation ?? 0) + deltaDeg),
    x: Math.round(point.x + (x - point.x) * cos - (y - point.y) * sin),
    y: Math.round(point.y + (x - point.x) * sin + (y - point.y) * cos),
  };
}
