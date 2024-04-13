import { vars } from "@repo/theme";
import { calc } from "@vanilla-extract/css-utils";
import { useMemo } from "react";
import { calculateProgress } from "./progress.utils";

interface ProgressBaseProps {
  value: number;
  max: number;
  min?: number;
  label: string;
}

interface CircularBaseProps extends ProgressBaseProps {
  size?: string;
  /** Width amount between 0 and 1 (is multiplied with `size`) */
  arcWidth?: number;
}

export interface CircularProps extends CircularBaseProps {
  frontColor?: string;
  backColor?: string | null;
}

export interface CircularColorStepProps extends CircularBaseProps {
  steps?: Record<number, string>;
  backColor?: string | null;
}

export const DEFAULT_COLOR_STEPS = {
  0: vars.colors.primary.base,
  50: vars.colors.warning.base,
  75: vars.colors.destructive.base,
} as const satisfies CircularColorStepProps["steps"];

/**
 * Circular progress indicator, with the indicator color depending on the current
 * percentage. The colors are supplied by `steps`. If a current percentage cannot be
 * correlated to any supplied step, the `frontColor` defaults to `transparent`.
 *
 * @param steps the color steps, bound to their respective minimum percentage.
 * @param value the value of the progress
 * @param min the minimum value of the progress
 * @param max the maximum value of the progress
 * @param restProps
 * @constructor
 */
export function CircularColorStep({
  steps = DEFAULT_COLOR_STEPS,
  value,
  min,
  max,
  ...restProps
}: CircularColorStepProps) {
  const progress = calculateProgress(value, max, min);
  const color = useMemo(() => {
    const stepKey = Object.keys(steps)
      .map(Number)
      .sort((a, b) => b - a)
      .find((key) => progress >= key);
    if (stepKey == null) return "transparent";
    return steps[stepKey as keyof typeof steps];
  }, [progress]);

  return (
    <Circular
      {...restProps}
      frontColor={color}
      value={value}
      min={min}
      max={max}
    />
  );
}

export function Circular({
  value,
  max,
  min = 0,
  arcWidth = 0.3,
  size = "1em",
  frontColor = vars.colors.primary.base,
  backColor = vars.colors.overlay,
  label,
}: CircularProps) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "100%",
        mask: `radial-gradient(${calc.multiply(size, arcWidth)}, #0000 95%, #000)`,
      }}
      role={"progressbar"}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
    >
      <AngledCircle
        frontColor={frontColor}
        backColor={backColor || "transparent"}
        progress={calculateProgress(value, max, min)}
      />
    </div>
  );
}

function AngledCircle({
  frontColor,
  backColor,
  progress,
}: {
  frontColor: string;
  backColor: string;
  /** The progress of the arc in percent in range of [0, 100] */
  progress: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `conic-gradient(${frontColor} ${progress}%, ${backColor} ${progress}%)`,
      }}
    />
  );
}
