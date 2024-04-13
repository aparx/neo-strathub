import { vars } from "@repo/theme";
import { Flexbox, Progress, Text } from "@repo/ui/components";
import * as css from "./teamSection.css";

export async function TeamSection({ teamId }: { teamId: string }) {
  // TODO fetch team using memoized function (react-cache)

  return (
    <Flexbox asChild orient={"vertical"} gap={"lg"}>
      <section className={css.section}>
        <Flexbox asChild gap={"xl"}>
          <header>
            <Text type={"title"} size={"sm"}>
              Team {teamId}
            </Text>
            <span>Label</span>
          </header>
        </Flexbox>
        <Flexbox orient={"vertical"} gap={"md"}>
          <Statistic name={"Members"} value={6} maximum={25} />
          <Statistic name={"Collections"} value={27} maximum={50} />
          <Statistic name={"Strategies"} value={367} maximum={450} />
        </Flexbox>
      </section>
    </Flexbox>
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
        <div>{name}</div>
        <Flexbox gap="md" align={"center"} style={{ fontWeight: 500 }}>
          {value}
          <Progress.CircularColorStep
            size={"1.2em"}
            value={value}
            max={maximum}
          />
        </Flexbox>
      </Text>
    </Flexbox>
  );
}
