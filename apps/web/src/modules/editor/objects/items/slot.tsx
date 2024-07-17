import { createForegroundSlotColor } from "@/app/(app)/editor/[documentId]/_partial/characters/components";
import { TransformerContainer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Icon } from "@repo/ui/components";
import { ComponentPropsWithoutRef } from "react";
import { HiExternalLink } from "react-icons/hi";
import { useOverlayItemContext } from "./provider";
import * as css from "./slot.css";

export type SlotProps = ComponentPropsWithoutRef<"button">;

export function Slot({ onClick, disabled, style, ...restProps }: SlotProps) {
  const { editor } = useOverlayItemContext();
  const { config } = TransformerContainer.useTransformerContainer();
  const character = config.characterId
    ? editor.characters[config.characterId]
    : null;
  const slotColor =
    character?.player_slot?.color || vars.colors.emphasis.medium;

  return (
    <button
      className={css.button({ disabled })}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        console.log("perform event");
      }}
      style={{
        background: slotColor,
        color: createForegroundSlotColor(slotColor),
        ...style,
      }}
      {...restProps}
    >
      {character?.index != null ? 1 + character.index : "?"}
      <Icon.Custom size="sm">
        <HiExternalLink />
      </Icon.Custom>
    </button>
  );
}
