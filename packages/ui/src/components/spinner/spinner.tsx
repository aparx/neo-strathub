import { vars } from "@repo/theme";
import { PiSpinnerBold } from "react-icons/pi";
import * as css from "./spinner.css";

export interface SpinnerProps {
  /** @default "1em" */
  size?: string | number;
  /** @default vars.colors.foreground */
  color?: string;
}

export function Spinner({
  size = "1.2em",
  color = vars.colors.foreground,
}: SpinnerProps) {
  return <PiSpinnerBold className={css.spinner} color={color} size={size} />;
}
