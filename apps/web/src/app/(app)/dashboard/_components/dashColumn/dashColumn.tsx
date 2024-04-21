import { mergeClassNames } from "@repo/utils";
import { forwardRef, HTMLAttributes } from "react";
import * as css from "./dashColumn.css";

export function Root({ children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={css.root}>{children}</div>;
}

export const Header = createPart(css.header);
export const Content = createPart(css.content);
export const Footer = createPart(css.footer);

function createPart(baseClassName: string) {
  return forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function _DashColumnPartial({ className, ...restProps }, ref) {
      return (
        <div
          ref={ref}
          className={mergeClassNames(baseClassName, className)}
          {...restProps}
        />
      );
    },
  );
}
