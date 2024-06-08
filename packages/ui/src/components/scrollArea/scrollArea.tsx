"use client";
import * as Primitive from "@radix-ui/react-scroll-area";
import { mergeClassNames } from "@repo/utils";
import * as css from "./scrollArea.css";

export type ScrollAreaProps = Primitive.ScrollAreaProps;
export type ScrollAreaViewportProps = Primitive.ScrollAreaViewportProps;

export function Root({ children, className, ...restProps }: ScrollAreaProps) {
  return (
    <Primitive.Root
      className={mergeClassNames(className, css.root)}
      {...restProps}
    >
      {children}
    </Primitive.Root>
  );
}

export function Content({
  children,
  className,
  ...restProps
}: ScrollAreaViewportProps) {
  return (
    <>
      <Primitive.Viewport
        className={mergeClassNames(className, css.viewport)}
        {...restProps}
      >
        {children}
      </Primitive.Viewport>
      <Primitive.Scrollbar orientation="horizontal" className={css.scrollbar}>
        <Primitive.Thumb className={css.thumb} />
      </Primitive.Scrollbar>
      <Primitive.Scrollbar orientation="vertical" className={css.scrollbar}>
        <Primitive.Thumb className={css.thumb} />
      </Primitive.Scrollbar>
      <Primitive.Corner />
    </>
  );
}
