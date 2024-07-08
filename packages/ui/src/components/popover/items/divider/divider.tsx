import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./divider.css";

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
