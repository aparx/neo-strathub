import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Text } from "../text";
import * as css from "./iconButton.css";

type IconButtonBaseProps = ComponentPropsWithoutRef<"button">;

export type IconButtonProps = IconButtonBaseProps &
  css.ButtonVariants & {
    asChild?: boolean;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const { asChild, disabled, className, color, ...restProps } = props;
    const Component = asChild ? Slot : "button";
    return (
      <Text asChild>
        <Component
          ref={ref}
          className={mergeClassNames(
            css.button({ disabled, color }),
            className,
          )}
          disabled={disabled}
          {...restProps}
        />
      </Text>
    );
  },
);
