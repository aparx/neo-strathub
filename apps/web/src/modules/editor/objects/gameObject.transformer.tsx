import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { DefaultTransformer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Nullish } from "@repo/utils";
import Konva from "konva";
import { forwardRef } from "react";
import { GameObjectConfig } from "./gameObject";

export interface GameObjectTransformerProps {
  shown: boolean;
  link: Konva.Node | Nullish;
  config: GameObjectConfig;
}

export const GameObjectTransformer = forwardRef<
  Konva.Transformer,
  GameObjectTransformerProps
>(function GameObjectTransformer({ shown, link, config }, ref) {
  const [editor] = useEditorContext();
  const character = config.characterId
    ? editor.characters[config.characterId]
    : null;
  const slotColor = character?.player_slot?.color || vars.colors.foreground;

  return (
    <DefaultTransformer ref={ref} keepRatio link={link} shown={shown}>
      <div
        style={{
          background: slotColor,
          color: `color-mix(in srgb, black 90%, ${slotColor})`,
          fontWeight: 700,
          height: `100%`,
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: vars.roundness.sm,
          border: `1px solid ${vars.colors.outline.card}`,
        }}
      >
        #{1 + (character?.player_slot?.index ?? 0)}
      </div>
    </DefaultTransformer>
  );
});
