import { vars } from "@repo/theme";
import { Button, Flexbox, Progress, Text } from "@repo/ui/components";
import { MdArrowForward } from "react-icons/md";
import * as css from "./teamSection.css";

export async function TeamSection({ teamId }: { teamId: string }) {
  // TODO fetch team using memoized function (react-cache)
  return (
    <section>
      <div className={css.main}>
        <Flexbox asChild gap={"lg"} align={"center"}>
          <header>
            <Text type={"title"} size={"sm"}>
              Team {teamId}
            </Text>
          </header>
        </Flexbox>
        <Flexbox orient={"vertical"} gap={"md"}>
          <Statistic name={"Members"} value={6} maximum={25} />
          <Statistic name={"Books"} value={27} maximum={50} />
          <Statistic name={"Blueprints"} value={367} maximum={450} />
        </Flexbox>
      </div>
      <div className={css.annotation} style={{ borderTop: "unset" }}>
        <Button color={"cta"} appearance={"cta"} className={css.upgradeButton}>
          Upgrade Plan
          <MdArrowForward />
        </Button>
      </div>
    </section>
  );
}

function Statistic({
  name,
  value,
  maximum,
}: {
  name: string;
  value: number;
  maximum: number;
}) {
  return (
    <Flexbox asChild justify={"space-between"} align={"center"}>
      <Text style={{ color: vars.colors.emphasis.medium }}>
        {name}
        <Flexbox gap="md" align={"center"} style={{ fontWeight: 500 }}>
          {value}
          <Progress.CircularColorStep
            label={"Progress"}
            size={"1.2em"}
            value={value}
            max={maximum}
          />
        </Flexbox>
      </Text>
    </Flexbox>
  );
}
