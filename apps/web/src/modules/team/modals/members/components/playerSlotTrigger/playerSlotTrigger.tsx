"use client";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { blendColors } from "@repo/ui/utils";
import { ComponentPropsWithoutRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import * as css from "./playerSlotTrigger.css";

interface MemberPlayerSlotBaseProps {
  slot?: { color: string; index: number | null } | null;
  disabled?: boolean;
}

export type MemberPlayerSlotProps = Omit<
  ComponentPropsWithoutRef<"button">,
  keyof MemberPlayerSlotBaseProps
> &
  MemberPlayerSlotBaseProps;

export function PlayerSlotTrigger({
  slot,
  disabled,
  ...restProps
}: MemberPlayerSlotProps) {
  return (
    <Text
      asChild
      type={"label"}
      size={"md"}
      data={{ weight: 500 }}
      className={css.slot({ active: slot != null, disabled })}
      style={{
        color: slot ? slot.color : undefined,
        background: slot ? blendColors(slot.color, "black 80%") : undefined,
      }}
    >
      <button {...restProps} disabled={disabled} data-disabled={disabled}>
        <Text
          type={"label"}
          size={"md"}
          data={{ weight: 700 }}
          className={css.number}
          style={{
            background: slot ? slot.color : vars.colors.accents[5],
            color: slot ? vars.colors.accents[0] : vars.colors.emphasis.low,
          }}
        >
          {slot ? 1 + (slot.index ?? 0) : "#"}
        </Text>
        {slot ? "Player" : "Assign"}
        <div className={css.arrow}>
          <Icon.Custom size={"sm"}>
            <FiExternalLink />
          </Icon.Custom>
        </div>
      </button>
    </Text>
  );
}
