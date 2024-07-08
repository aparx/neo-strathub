"use client";
import * as Primitive from "@radix-ui/react-popover";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { Icon } from "../icon";
import { IconButton } from "../iconButton";
import * as css from "./popover.css";

export const Root = Primitive.Root;

export const Trigger = Primitive.Trigger;

export const Close = Primitive.Close;

export type PopoverTriggerProps = Primitive.PopoverTriggerProps;

export type PopoverContentProps = Omit<
  Primitive.PopoverContentProps,
  "asChild"
>;

type PopoverExpandBaseProps = Omit<PopoverTriggerProps, "asChild">;

export interface PopoverExpandProps extends PopoverExpandBaseProps {
  /** If true, the button will fade-in, in a specific way */
  fadeIn?: boolean;
}

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



export function Expand({ children, fadeIn, ...restProps }: PopoverExpandProps) {
  return (
    <Trigger asChild {...restProps}>
      <IconButton className={css.expandShell({ fadeIn })}>
        {children}
        <Icon.Custom className={css.expandIcon({ fadeIn })}>
          <MdExpandMore />
        </Icon.Custom>
      </IconButton>
    </Trigger>
  );
}
