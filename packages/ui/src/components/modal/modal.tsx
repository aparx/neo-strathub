"use client";
import * as Primitive from "@radix-ui/react-dialog";
import { mergeClassNames } from "@repo/utils";
import { ComponentProps, useEffect, useState } from "react";
import { Icon } from "../icon";
import { IconButton } from "../iconButton";
import { Text } from "../text";
import * as css from "./modal.css";

export const Trigger = Primitive.Trigger;
export const Close = Primitive.Close;

export function Root({
  defaultOpen,
  open,
  onOpenChange,
  ...restProps
}: Primitive.DialogProps) {
  const [initialOpen, setInitialOpen] = useState<boolean>();

  useEffect(() => {
    if (defaultOpen) setInitialOpen(true);
  }, []);

  return (
    <Primitive.Root
      open={open || initialOpen}
      onOpenChange={(val) => {
        if (initialOpen) setInitialOpen(val);
        onOpenChange?.(val);
      }}
      {...restProps}
    />
  );
}

export function Exit() {
  return (
    <Close asChild>
      <IconButton>
        <Icon.Mapped type={"close"} />
      </IconButton>
    </Close>
  );
}

export function Title({ className, ...restProps }: Primitive.DialogTitleProps) {
  return (
    <Text asChild type={"title"} size={"sm"}>
      <Primitive.Title
        className={mergeClassNames(className, css.title)}
        {...restProps}
      />
    </Text>
  );
}

export function Content({
  className,
  ...restProps
}: Primitive.DialogContentProps) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className={css.scrim} />
      <Primitive.Content
        className={mergeClassNames(className, css.content)}
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
