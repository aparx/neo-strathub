import { sprinkles, vars } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { createLineHeight } from "../../utils";
import * as css from "./skeleton.css";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  /** @default "sm" */
  roundness?: keyof typeof vars.roundness;
  width?: string | number;
  height?: string | number;
  outline?: boolean;
}

export function Skeleton({
  outline,
  roundness = "sm",
  width,
  height = createLineHeight("1em"),
  style,
  className,
  ...restProps
}: SkeletonProps) {
  return (
    <div
      className={mergeClassNames(
        css.skeleton,
        outline && sprinkles({ outline: "card" }),
        className,
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
