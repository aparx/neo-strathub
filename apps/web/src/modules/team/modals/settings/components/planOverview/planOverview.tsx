import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Progress, Text } from "@repo/ui/components";
import type { CardVariants } from "./planOverview.css";
import * as css from "./planOverview.css";

export type PlanOverviewProps = CardVariants & {
  name: string;
  canUpgrade?: boolean;
  /** Total usage in percent in range [0, 100] */
  usage: number;
};

export function PlanOverview({
  color,
  name,
  canUpgrade,
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
        </Flexbox>
      </Text>
      <Button appearance={"cta"} color={"cta"}>
        {canUpgrade ? "Upgrade" : "Need more?"}
        <Icon.Mapped type={"upgrade"} />
      </Button>
    </div>
  );
}
