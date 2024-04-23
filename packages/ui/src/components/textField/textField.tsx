import { mergeClassNames, Nullish } from "@repo/utils";
import { InputHTMLAttributes } from "react";
import { Text } from "../text";
import * as css from "./textField.css";

type TextFieldBaseProps = InputHTMLAttributes<HTMLInputElement>;

export interface TextFieldProps extends TextFieldBaseProps {
  leading?: React.ReactNode;
  error?: Nullish | string | string[];
}

export function TextField({
  leading,
  disabled,
  className,
  style,
  error,
  ...restProps
}: TextFieldProps) {
  const hasError = error != null;
  const state = disabled ? "disabled" : hasError ? "error" : "default";

  return (
    <Text>
      <label
        className={mergeClassNames(css.shell({ state }), className)}
        style={style}
        data-state={state}
      >
        {leading != null && leading}
        <input
          className={css.input}
          type={"text"}
          disabled={disabled}
          {...restProps}
        />
      </label>
      {error != null ? (
        <Text asChild type={"label"} size={"sm"}>
          <p aria-live={"assertive"} className={css.error}>
            {Array.isArray(error) ? error.join(", ") : error}
          </p>
        </Text>
      ) : null}
    </Text>
  );
}
