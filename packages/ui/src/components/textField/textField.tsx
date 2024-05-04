import { vars } from "@repo/theme";
import { Icon } from "@repo/ui/components";
import { mergeClassNames, Nullish } from "@repo/utils";
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
  label?: string;
}

export function TextField({
  leading,
  disabled,
  className,
  style,
  error,
  required,
  label,
  type = "text",
  ...restProps
}: TextFieldProps) {
  const hasError = error != null;
  const state = disabled ? "disabled" : hasError ? "error" : "default";

  return (
    <Text
      className={mergeClassNames(className, css.root)}
      data-state={state}
      style={style}
    >
      {label && (
        <Text type={"label"} size={"lg"} className={css.textLabel}>
          {label} {required ? <span className={css.asterisk}>*</span> : null}
        </Text>
      )}
      <label className={css.shell({ state })}>
        {leading}
        <input
          className={css.input}
          disabled={disabled}
          type={type}
          required={required}
          {...restProps}
        />
        {hasError && <ErrorIcon />}
      </label>
      {hasError && <Error error={error} />}
    </Text>
  );
}

function Error({ error }: { error: Nullish | string | string[] }) {
  return (
    <Text asChild type={"label"} size={"md"}>
      <p aria-live={"assertive"} className={css.error}>
        {Array.isArray(error) ? error.join(", ") : error}
      </p>
    </Text>
  );
}

function ErrorIcon() {
  return (
    <Icon.Custom>
      <VscError
        color={vars.colors.destructive.lighter}
        className={css.errorIcon}
      />
    </Icon.Custom>
  );
}
