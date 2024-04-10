import { mergeClassNames } from "@repo/utils";
import { HTMLAttributes } from "react";
import * as css from "./dashColumn.css";

export function Root({ children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={css.root}>{children}</div>;
}

export const Header = createPartial(css.header);
export const Content = createPartial(css.content);
export const Footer = createPartial(css.footer);

function createPartial(baseClassName: string) {
  return function _DashColumnPartial({
    className,
    ...restProps
  }: HTMLAttributes<HTMLDivElement>) {
    return (
      <div
        className={mergeClassNames(baseClassName, className)}
        {...restProps}
      />
    );
  };
}
