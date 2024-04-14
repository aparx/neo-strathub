import { sprinkles, vars } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { calc } from "@vanilla-extract/css-utils";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./skeleton.css";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  /** @default "sm" */
  roundness?: keyof typeof vars.roundness;
  width?: string | number;
  height?: string | number;
  outline?: boolean;
}

const defaultHeight = calc.add(
  calc.multiply(2, vars.spacing.sm),
  vars.fontSizes.body.md,
);

export function Skeleton({
  outline,
  roundness = "sm",
  width,
  height = defaultHeight,
  style,
  ...restProps
}: SkeletonProps) {
  return (
    <div
      className={mergeClassNames(
        css.skeleton,
        outline && sprinkles({ outline: "card" }),
      )}
      style={{
        width,
        height,
        borderRadius: vars.roundness[roundness],
        ...style,
      }}
      {...restProps}
    />
  );
}
