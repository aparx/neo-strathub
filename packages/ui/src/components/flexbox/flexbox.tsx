import { Slot } from "@radix-ui/react-slot";
import type { Sprinkles } from "@repo/theme";
import { sprinkles } from "@repo/theme";
import { HTMLAttributes, forwardRef } from "react";

export interface FlexboxProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  justify?: Sprinkles["justifyContent"];
  align?: Sprinkles["alignItems"];
  gap?: Sprinkles["gap"];
  dir?: "horizontal" | "vertical";
  asChild?: boolean;
  wrap?: boolean | Sprinkles["flexWrap"];
}

export const Flexbox = forwardRef<HTMLDivElement, FlexboxProps>(
  function Flexbox(props, ref) {
    const { asChild, justify, align, dir, gap, wrap, ...restProps } = props;
    const Component = asChild ? Slot : "div";
    return (
      <Component
        ref={ref}
        className={sprinkles({
          display: "flex",
          flexWrap: wrap === true ? "wrap" : wrap || "nowrap",
          flexDirection: dir === "vertical" ? "column" : "row",
          justifyContent: justify,
          alignItems: align,
          gap,
        })}
        {...restProps}
      />
    );
  },
);
