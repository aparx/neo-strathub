import { vars } from "@repo/theme";
import { HTMLAttributes } from "react";
import { PiSpinnerBold } from "react-icons/pi";
import * as css from "./spinner.css";

export interface SpinnerProps extends HTMLAttributes<HTMLElement> {
  /** @default "1em" */
  size?: string | number;
  /** @default vars.colors.foreground */
  color?: string;
}

export function Spinner({
  size = "1.2em",
  color = vars.colors.foreground,
  ...restProps
}: SpinnerProps) {
  return (
    <PiSpinnerBold
      className={css.spinner}
      color={color}
      size={size}
      {...restProps}
    />
  );
}
