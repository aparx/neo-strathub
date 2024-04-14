"use client";
import { Slot } from "@radix-ui/react-slot";
import { mergeClassNames } from "@repo/utils";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

type AnimationState = "playing" | "stopped";

export interface AnimatorProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  /** The css class or classes involved in the animation */
  classes: string | string[];
  asChild?: boolean;
  playing?: boolean;
  defaultPlaying?: boolean;
}

export interface AnimatorRef {
  state: AnimationState;
  play: () => void;
  stop: () => void;
}

export const Animator = forwardRef<AnimatorRef, AnimatorProps>(
  function Animator(props, ref) {
    const {
      asChild,
      playing,
      defaultPlaying,
      classes,
      className,
      ...restProps
    } = props;
    const [state, setState] = useState<AnimationState>(
      defaultPlaying ? "playing" : "stopped",
    );

    // Acquire state of props if even given
    useEffect(() => {
      if (playing == null) return;
      setState(playing ? "playing" : "stopped");
    }, [playing]);

    // prettier-ignore
    useImperativeHandle(ref, () => ({
      state: state,
      play: () => setState("playing"),
      stop: () => setState("stopped")
    }), []);

    const classNames = useMemo(() => {
      if (state === "stopped") return className;
      if (Array.isArray(classes)) return mergeClassNames(className, ...classes);
      if (classes) return mergeClassNames(className, classes);
      console.warn("Animation classes are not provided");
      return className;
    }, [state]);

    const Component = asChild ? Slot : "div";
    return (
      <Component
        {...restProps}
        className={classNames}
        onAnimationStart={(e) => {
          restProps.onAnimationStart?.(e);
          if (!e.isDefaultPrevented()) setState("playing");
        }}
        onAnimationEnd={(e) => {
          restProps.onAnimationEnd?.(e);
          if (!e.isDefaultPrevented()) setState("stopped");
        }}
      />
    );
  },
);
