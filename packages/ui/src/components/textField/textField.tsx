import { vars } from "@repo/theme";
import { Icon } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import { CSSProperties, InputHTMLAttributes } from "react";
import { VscError } from "react-icons/vsc";
import { Text } from "../text";
import * as css from "./textField.css";

type TextFieldBaseProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "autoComplete"
  | "disabled"
  | "maxLength"
  | "minLength"
  | "name"
  | "pattern"
  | "placeholder"
  | "readOnly"
  | "required"
  | "defaultValue"
  | "onInput"
  | "onInputCapture"
  | "onBeforeInput"
  | "onBeforeInputCapture"
>;

export interface TextFieldProps extends TextFieldBaseProps {
  type?: "text" | "number";
  style?: CSSProperties;
  className?: string;
  leading?: React.ReactNode;
  error?: Nullish | string | string[];
}

export function TextField({
  leading,
  disabled,
  className,
  style,
  error,
  type = "text",
  ...restProps
}: TextFieldProps) {
  const hasError = error != null;
  const state = disabled ? "disabled" : hasError ? "error" : "default";

  return (
    <Text className={className} style={style}>
      <label className={css.shell({ state })} data-state={state}>
        {leading != null && leading}
        <input
          className={css.input}
          disabled={disabled}
          type={type}
          {...restProps}
        />
        {error != null && <ErrorIcon />}
      </label>
      {error != null ? (
        <Text asChild type={"label"} size={"md"}>
          <p aria-live={"assertive"} className={css.error}>
            {Array.isArray(error) ? error.join(", ") : error}
          </p>
        </Text>
      ) : null}
    </Text>
  );
}

export function ErrorIcon() {
  return (
    <Icon.Custom>
      <VscError
        color={vars.colors.destructive.lighter}
        className={css.errorIcon}
      />
    </Icon.Custom>
  );
}
