import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { Text } from "../../../text";
import * as css from "./button.css";

export type ItemProps = ComponentPropsWithoutRef<"button"> &
  css.ButtonVariants & {
    asChild?: boolean;
  };

export function Button({
  className,
  asChild,
  color,
  disabled,
  size,
  ...restProps
}: ItemProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Text asChild>
      <Component
        className={mergeClassNames(
          css.button({ color, disabled, size }),
          className,
        )}
        aria-disabled={disabled}
        {...restProps}
      />
    </Text>
  );
}
