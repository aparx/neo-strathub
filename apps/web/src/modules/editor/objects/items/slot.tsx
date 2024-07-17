import { createForegroundSlotColor } from "@/app/(app)/editor/[documentId]/_partial/characters/components";
import { TransformerContainer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { mergeClassNames, nonNull } from "@repo/utils";
import { ComponentPropsWithoutRef, useId, useMemo, useState } from "react";
import { HiExternalLink } from "react-icons/hi";
import { RxValueNone } from "react-icons/rx";
import { useOverlayItemContext } from "./provider";
import * as css from "./slot.css";

export type SlotProps = ComponentPropsWithoutRef<"button">;

export function Slot({ onClick, disabled, style, ...restProps }: SlotProps) {
  const { editor, handler } = useOverlayItemContext();
  const { config } = TransformerContainer.useTransformerContainer();
  const character = config.characterId
    ? editor.characters[config.characterId]
    : null;
  const slotColor =
    character?.player_slot?.color || vars.colors.emphasis.medium;

  const [opened, setOpened] = useState(false);
  const id = useId();

  return (
    <>
      <Text asChild data={{ weight: 800, font: "mono" }}>
        <button
          aria-controls={id}
          aria-checked={opened}
          className={css.button({ disabled })}
          disabled={disabled}
          onClick={(e) => {
            onClick?.(e);
            if (e.defaultPrevented) return;
            setOpened((old) => !old);
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
      </Text>
      {opened && (
        <SlotSelector
          id={id}
          onSelectSlot={(characterId) => {
            handler.fire("canvasUpdate", "user", {
              fields: { [config.id]: { characterId } },
            });
            setOpened(false);
          }}
        />
      )}
    </>
  );
}

function SlotSelector({
  className,
  onSelectSlot,
  ...restProps
}: ComponentPropsWithoutRef<"ol"> & {
  onSelectSlot?: (id: number | undefined) => void;
}) {
  const { editor } = useOverlayItemContext();
  const { config } = TransformerContainer.useTransformerContainer();

  const characters = useMemo(
    () =>
      Object.keys(editor.characters)
        .map((key) => editor.characters[Number(key)])
        .filter(nonNull),
    [editor.characters],
  );

  return (
    <ol className={mergeClassNames(css.selector, className)} {...restProps}>
      {[null, ...characters].map((character) => {
        const backColor =
          character?.player_slot?.color ?? vars.colors.foreground;
        const foreColor = createForegroundSlotColor(backColor);

        const isActive = config.characterId == character?.id;
        //                                  ^ Loose Comparison wanted (nullish)

        return (
          <li>
            <Text asChild data={{ font: "mono", weight: isActive ? 800 : 500 }}>
              <button
                className={css.selectorItem({ active: isActive })}
                onClick={() => onSelectSlot?.(character?.id)}
                key={String(character?.id)}
                style={{
                  background: isActive ? backColor : undefined,
                  color: isActive ? foreColor : backColor,
                }}
              >
                {character ? 1 + character.index : <RxValueNone />}
              </button>
            </Text>
          </li>
        );
      })}
    </ol>
  );
}
