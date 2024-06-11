import { CanvasContext } from "@repo/canvas";
import { Text } from "@repo/ui/components";
import * as css from "./levelIndicator.css";

export function LevelIndicator({
  levelNumber,
  focused,
  canvas,
}: {
  levelNumber: number;
  focused?: boolean;
  canvas: CanvasContext;
}) {
  return (
    <Text
      type="label"
      size="md"
      data={{ weight: 600 }}
      className={css.indicator({ focused })}
      style={{ scale: Math.min(1 / canvas.scale.state, 4) }}
      aria-hidden
    >
      {levelNumber}
    </Text>
  );
}
