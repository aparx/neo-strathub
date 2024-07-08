import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import React, { ButtonHTMLAttributes } from "react";
import { Text } from "../text";
import * as css from "./button.css";

type ButtonBaseProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof css.ButtonVariants
> &
  css.ButtonVariants;

export interface ButtonProps extends ButtonBaseProps {
  children?: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  asChild,
  className,
  color,
  appearance,
  disabled,
  size,
  ...restProps
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Text asChild>
      <Component
        className={mergeClassNames(
          className,
          css.button({ color, appearance, disabled, size }),
        )}
        aria-disabled={disabled}
        disabled={disabled}
        {...restProps}
      />
    </Text>
  );
}
