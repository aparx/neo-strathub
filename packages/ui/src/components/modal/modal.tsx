"use client";
import * as Primitive from "@radix-ui/react-dialog";
import { vars } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { calc } from "@vanilla-extract/css-utils";
import { ComponentProps } from "react";
import { Icon } from "../icon";
import { IconButton } from "../iconButton";
import { Text } from "../text";
import * as css from "./modal.css";

export const Trigger = Primitive.Trigger;
export const Close = Primitive.Close;
export const Root = Primitive.Root;

export function Exit({ disabled }: { disabled?: boolean }) {
  return (
    <Close asChild>
      <IconButton aria-label={"Close modal"} disabled={disabled}>
        <Icon.Mapped type={"close"} />
      </IconButton>
    </Close>
  );
}

export function Title({ className, ...restProps }: Primitive.DialogTitleProps) {
  return (
    <Text asChild type={"title"} size={"md"}>
      <Primitive.Title
        className={mergeClassNames(className, css.title)}
        {...restProps}
      />
    </Text>
  );
}

export function Content({
  className,
  minWidth = 450,
  style,
  ...restProps
}: Primitive.DialogContentProps & {
  minWidth?: number;
}) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className={css.scrim} />
      <Primitive.Content
        className={mergeClassNames(className, css.content)}
        style={{
          minWidth: `min(${calc.subtract("100dvw", calc.multiply(2, vars.spacing.md))}, ${minWidth}px)`,
          ...style,
        }}
        {...restProps}
      />
    </Primitive.Portal>
  );
}

export function Separator({ className, ...restProps }: ComponentProps<"div">) {
  return (
    <div className={mergeClassNames(className, css.separator)} {...restProps} />
  );
}
