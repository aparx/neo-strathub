import { createForegroundSlotColor } from "@/app/(app)/editor/[documentId]/_partial/characters/components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TransformerContainer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { mergeClassNames, nonNull } from "@repo/utils";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { HiExternalLink } from "react-icons/hi";
import { RxValueNone } from "react-icons/rx";
import { useOnClickOutside } from "usehooks-ts";
import { useOverlayItemContext } from "./provider";
import * as css from "./slot.css";

export type SlotProps = ComponentPropsWithoutRef<"button">;

interface SlotSelectorProps extends ComponentPropsWithoutRef<"fieldset"> {
  onSelectSlot?: (id: number | undefined) => void;
}

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

  const portalRef = useRef<HTMLFieldSetElement>(null);
  useOnClickOutside(portalRef, () => setOpened(false));

  const slotNumber = character ? 1 + character.index : -1;

  return (
    <>
      <Text asChild data={{ weight: 800, font: "mono" }}>
        <button
          aria-label={`Change Slot (Current: ${
            slotNumber >= 0 ? slotNumber : "None"
          })`}
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
          ref={portalRef}
          onSelectSlot={(characterId) => {
            handler.fire("canvasUpdate", "user", {
              fields: { [config.id]: { characterId: characterId ?? null } },
            });
            setOpened(false);
          }}
        />
      )}
    </>
  );
}

const SlotSelector = forwardRef<HTMLFieldSetElement, SlotSelectorProps>(
  function SlotSelector(props, ref) {
    const { className, onSelectSlot, ...restProps } = props;

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
      <fieldset
        ref={ref}
        className={mergeClassNames(css.selector, className)}
        {...restProps}
      >
        {[null, ...characters].map((character) => {
          const backColor =
            character?.player_slot?.color ?? vars.colors.foreground;
          const foreColor = createForegroundSlotColor(backColor);
          const isActive = config.characterId == character?.id;
          const slotNumber = character ? 1 + character.index : -1;

          return (
            <Text asChild data={{ font: "mono", weight: isActive ? 800 : 500 }}>
              <label
                aria-label={slotNumber >= 0 ? `Slot ${slotNumber}` : `No Slot`}
                className={css.selectorItem({ active: isActive })}
                style={{
                  background: isActive ? backColor : undefined,
                  color: isActive ? foreColor : backColor,
                }}
              >
                <VisuallyHidden>
                  <input
                    type="radio"
                    name="slot"
                    checked={isActive}
                    onChange={(e) =>
                      e.target.checked && onSelectSlot?.(character?.id)
                    }
                  />
                </VisuallyHidden>
                {slotNumber >= 0 ? slotNumber : <RxValueNone />}
              </label>
            </Text>
          );
        })}
      </fieldset>
    );
  },
);
