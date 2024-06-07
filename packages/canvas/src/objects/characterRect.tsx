import { CanvasContextFunctions } from "context/canvasContext";
import Konva from "konva";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import * as ReactKonva from "react-konva";
import { CanvasNodeConfig, NodeTags } from "../utils";

export interface CharacterRectProps {
  hidden?: boolean;
  slot: ReturnType<CanvasContextFunctions["getCharacterSlot"]>;
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
        stroke={slot?.color}
        strokeWidth={3}
        strokeScaleEnabled={false}
      />
    );
  },
);
