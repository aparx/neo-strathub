import { Slot } from "@radix-ui/react-slot";
import type { Sprinkles } from "@repo/theme";
import { sprinkles } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface FlexboxProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  justify?: Sprinkles["justifyContent"];
  align?: Sprinkles["alignItems"];
  gap?: Sprinkles["gap"];
  orient?: "horizontal" | "vertical";
  asChild?: boolean;
  wrap?: boolean | Sprinkles["flexWrap"];
}

export const Flexbox = forwardRef<HTMLDivElement, FlexboxProps>(
  function Flexbox(props, ref) {
    const {
      asChild,
      justify,
      align,
      orient,
      gap,
      wrap,
      className,
      ...restProps
    } = props;
    const Component = asChild ? Slot : "div";
    return (
      <Component
        ref={ref}
        className={mergeClassNames(
          sprinkles({
            display: "flex",
            flexWrap: wrap === true ? "wrap" : wrap || "nowrap",
            flexDirection: orient === "vertical" ? "column" : "row",
            justifyContent: justify,
            alignItems: align,
            gap,
          }),
          className,
        )}
        {...restProps}
      />
    );
  },
);
