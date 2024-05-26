"use client";
import * as Primitive from "@radix-ui/react-tooltip";
import { FontSize } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { Text } from "../text";
import * as css from "./tooltip.css";

export const Provider = Primitive.Provider;
export const Root = Primitive.Root;
export const Trigger = Primitive.Trigger;

export type TooltipRootProps = Primitive.TooltipProps;

export interface TooltipContentProps extends Primitive.TooltipContentProps {
  /** @default "md" */
  size?: FontSize;
}

export function Content({
  children,
  className,
  size = "md",
  sideOffset = 5,
  ...restProps
}: TooltipContentProps) {
  return (
    <Primitive.Portal>
      <Text asChild type={"label"} data={{ weight: 400 }} size={size}>
        <Primitive.Content
          className={mergeClassNames(css.content, className)}
          {...restProps}
        >
          {children}
          <Primitive.Arrow className={css.arrow} />
        </Primitive.Content>
      </Text>
    </Primitive.Portal>
  );
}
