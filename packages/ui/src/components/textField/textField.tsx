import { vars } from "@repo/theme";
import { Icon } from "@repo/ui/components";
import { mergeClassNames, Nullish } from "@repo/utils";
import { CSSProperties, forwardRef, InputHTMLAttributes } from "react";
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
  | "value"
  | "pattern"
  | "placeholder"
  | "readOnly"
  | "required"
  | "defaultValue"
  | "onBlur"
  | "onBlurCapture"
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

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      leading,
      disabled,
      className,
      style,
      error,
      type = "text",
      ...restProps
    } = props;

    const hasError = error != null;
    const state = disabled ? "disabled" : hasError ? "error" : "default";

    return (
      <Text
        className={mergeClassNames(className, css.root)}
        data-state={state}
        style={style}
      >
        <label className={css.shell({ state })}>
          {leading}
          <input
            ref={ref}
            className={css.input}
            disabled={disabled}
            type={type}
            {...restProps}
          />
          {hasError && <ErrorIcon />}
        </label>
        {hasError && <Error error={error} />}
      </Text>
    );
  },
);

function Error({ error }: { error: Nullish | string | string[] }) {
  return (
    <Text asChild type={"label"} size={"md"}>
      <p aria-live={"assertive"} className={css.error}>
        {Array.isArray(error) ? error.filter(Boolean).join(", ") : error}
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
