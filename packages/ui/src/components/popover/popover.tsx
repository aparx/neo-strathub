"use client";
import * as Primitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { Text } from "../text";
import * as css from "./popover.css";

export const Root = Primitive.Root;

export const Trigger = Primitive.Trigger;

export const Close = Primitive.Close;

export type PopoverTriggerProps = Primitive.PopoverTriggerProps;

export type PopoverContentProps = Omit<
  Primitive.PopoverContentProps,
  "asChild"
>;

export function Content({
  children,
  className,
  ...restProps
}: PopoverContentProps) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        className={mergeClassNames(css.popover, className)}
        {...restProps}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  );
}

export type ItemProps = ComponentPropsWithoutRef<"button"> &
  css.ItemVariants & {
    asChild?: boolean;
  };

export function Item({
  className,
  asChild,
  color,
  disabled,
  ...restProps
}: ItemProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Text asChild>
      <Component
        className={mergeClassNames(css.item({ color, disabled }), className)}
        aria-disabled={disabled}
        {...restProps}
      />
    </Text>
  );
}

export type DividerProps = ComponentPropsWithoutRef<"div"> &
  css.DividerVariants;

export function Divider({ orient, className, ...restProps }: DividerProps) {
  return (
    <div
      className={mergeClassNames(css.divider({ orient }), className)}
      {...restProps}
    />
  );
}
