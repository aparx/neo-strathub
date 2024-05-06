import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import * as css from "./dashColumn.css";

export interface DashColumnProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

export const Root = createPart(css.root, "section");
export const Header = createPart(css.header, "header");
export const Content = createPart(css.content, "div");
export const Footer = createPart(css.footer, "footer");

function createPart<const TElement extends keyof HTMLElementTagNameMap>(
  styleClass: string,
  element: TElement,
) {
  return forwardRef<HTMLElementTagNameMap[TElement], DashColumnProps>(
    function _DashColumnPartial({ asChild, className, ...restProps }, ref) {
      const Component = asChild ? Slot : element;
      return (
        <Component
          ref={ref}
          className={mergeClassNames(styleClass, className)}
          {...restProps}
        />
      );
    },
  );
}
