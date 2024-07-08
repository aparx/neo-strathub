import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import * as css from "./field.css";

export type FieldProps = ComponentPropsWithoutRef<"label"> & css.FieldVariants;

export type FieldInputProps = ComponentPropsWithoutRef<"input">;

export function Root({ className, children, size, ...restProps }: FieldProps) {
  return (
    <label
      className={mergeClassNames(className, css.label({ size }))}
      {...restProps}
    >
      {children}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, FieldInputProps>(
  function Input({ children, ...restProps }, ref) {
    return (
      <input ref={ref} {...restProps}>
        {children}
      </input>
    );
  },
);
