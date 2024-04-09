import { InputHTMLAttributes } from "react";
import { Text } from "../text";
import * as css from "./textField.css";

type TextFieldBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export interface TextFieldProps extends TextFieldBaseProps {
  leading?: React.ReactNode;
}

export function TextField({ leading, disabled, ...restProps }: TextFieldProps) {
  return (
    <Text asChild>
      <label className={css.shell({ disabled })}>
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
