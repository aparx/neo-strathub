import { mergeClassNames } from "@repo/utils";
import { InputHTMLAttributes } from "react";
import { Text } from "../text";
import * as css from "./textField.css";

type TextFieldBaseProps = InputHTMLAttributes<HTMLInputElement>;

export interface TextFieldProps extends TextFieldBaseProps {
  leading?: React.ReactNode;
}

export function TextField({
  leading,
  disabled,
  className,
  style,
  ...restProps
}: TextFieldProps) {
  return (
    <Text asChild>
      <label
        className={mergeClassNames(css.shell({ disabled }), className)}
        style={style}
      >
        {leading != null && leading}
        <input
          className={css.input}
          type={"text"}
          disabled={disabled}
          {...restProps}
        />
      </label>
    </Text>
  );
}
