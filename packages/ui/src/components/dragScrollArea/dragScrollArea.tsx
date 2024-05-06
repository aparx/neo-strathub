"use client";
import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  CSSProperties,
  useCallback,
  useRef,
  useState,
} from "react";
import { useEventListener } from "usehooks-ts";

export interface DragScrollAreaProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

/**
 * Component that allows a user to drag the element in order to scroll in the
 * dimensions, that the element was dragged. This eliminates the need for a
 * interactable scrollbar.
 *
 * @param children
 * @param asChild
 * @param style
 * @param onMouseDown
 * @param restProps
 * @constructor
 */
export function DragScrollArea({
  children,
  asChild,
  style,
  onMouseDown,
  ...restProps
}: DragScrollAreaProps) {
  const [cursor, setCursor] = useState<CSSProperties["cursor"]>();

  const ref = useRef<HTMLDivElement>(null);
  const clickPosition = useRef<[x: number, y: number]>();

  const dragStart = useCallback((pointerX: number, pointerY: number) => {
    clickPosition.current = [
      pointerX + (ref.current?.scrollLeft ?? 0),
      pointerY + (ref.current?.scrollTop ?? 0),
    ];
    setCursor("grabbing");
  }, []);

  const dragMove = useCallback((pointerX: number, pointerY: number) => {
    if (!clickPosition.current || !ref.current) return;
    const [beginX, beginY] = clickPosition.current;
    ref.current.scrollLeft = beginX - pointerX;
    ref.current.scrollTop = beginY - pointerY;
  }, []);

  const dragStop = useCallback(() => {
    clickPosition.current = undefined;
    setCursor(undefined);
  }, []);

  useEventListener("mouseup", dragStop);
  useEventListener("touchend", dragStop);

  useEventListener("mousemove", (e) => dragMove(e.clientX, e.clientY));
  useEventListener("touchmove", (e) => {
    if (e.touches.length !== 1) return;
    dragMove(e.touches[0]!.clientX, e.touches[0]!.clientY);
  });

  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={ref}
      style={{ cursor: cursor, ...style }}
      data-grabbed={clickPosition.current != null}
      onMouseDown={(e) => {
        dragStart(e.clientX, e.clientY);
        onMouseDown?.(e);
      }}
      onTouchStart={(e) => {
        if (e.touches.length !== 1) return;
        dragStart(e.touches[0]!.clientX, e.touches[0]!.clientY);
      }}
      {...restProps}
    >
      {children}
    </Component>
  );
}
