import { CanvasContextFunctions } from "context/canvasContext";
import Konva from "konva";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig, NodeTags } from "../utils";

export interface CharacterRectProps {
  hidden?: boolean;
  slot: ReturnType<CanvasContextFunctions["onGetCharacterSlot"]>;
}

export interface CharacterRectRef<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> {
  /** Synchronizes the character rect to the given configuration */
  sync: (config: TConfig) => void;
}

export const CharacterRect = forwardRef<CharacterRectRef, CharacterRectProps>(
  function CharacterRect(props, ref) {
    const { hidden, slot } = props;
    const rectRef = useRef<Konva.Rect>(null);

    const sync = useCallback<CharacterRectRef["sync"]>((config) => {
      // TODO add margin between the target and the origin node/config
      const target = rectRef.current;
      if (!target) return;
      target.position({ x: config.x ?? 0, y: config.y ?? 0 });
      target.scale({ x: 1, y: 1 });
      target.rotation(config.rotation ?? 0);
      target.width((config.width ?? 0) * (config.scaleX ?? 1));
      target.height((config.height ?? 0) * (config.scaleY ?? 1));
    }, []);

    useImperativeHandle(ref, () => ({ sync }), [sync]);

    return (
      <ReactKonva.Rect
        ref={rectRef}
        listening={false}
        name={NodeTags.NO_SELECT}
        strokeEnabled={!hidden}
        stroke={useTranslateColor(slot?.color)}
        strokeWidth={3}
        strokeScaleEnabled={false}
        perfectDrawEnabled={false}
      />
    );
  },
);

function useTranslateColor(color: string | undefined) {
  return useMemo(() => {
    // If color is HSL convert it to RGB
    if (!color?.startsWith("hsl")) return color;
    const args = color.substring(4, color.length - 1).split(/\s*,\s*/);
    const h = Number(args[0]) / 360;
    const s = Number(args[1]!.substring(0, args[1]!.length - 1)) / 100;
    const l = Number(args[2]!.substring(0, args[2]!.length - 1)) / 100;
    const [r, g, b] = hslToRgb(h, s, l);
    return `rgb(${r}, ${g}, ${b})` as const;
  }, [color]);
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ] as const;
}

function hueToRgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
