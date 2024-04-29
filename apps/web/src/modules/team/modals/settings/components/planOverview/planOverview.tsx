import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Progress, Text } from "@repo/ui/components";
import type { CardVariants } from "./planOverview.css";
import * as css from "./planOverview.css";

export type PlanOverviewProps = CardVariants & {
  name: string;
  canUpgrade?: boolean;
  /** Total usage in percent in range [0, 100] */
  usage: number;
  pricing: string;
};

export function PlanOverview({
  color,
  name,
  canUpgrade,
  pricing,
  usage,
}: PlanOverviewProps) {
  return (
    <div className={css.card({ color })}>
      <Text asChild type={"body"} data={{ weight: 500 }}>
        <Flexbox gap={"md"} align={"center"}>
          <Progress.Circular
            size={"1.5em"}
            value={usage}
            max={100}
            label={"Usage"}
            frontColor={"currentColor"}
            backColor={vars.colors.overlay}
          />
          <span>{name}</span>
          <Text asChild type={"label"} data={{ weight: 400 }}>
            <div className={css.priceTag}>{pricing}</div>
          </Text>
        </Flexbox>
      </Text>
      <Button
        appearance={"icon"}
        color={"cta"}
        style={{ borderRadius: vars.roundness.full }}
        disabled={!canUpgrade}
      >
        <Icon.Mapped type={"upgrade"} />
      </Button>
    </div>
  );
}
