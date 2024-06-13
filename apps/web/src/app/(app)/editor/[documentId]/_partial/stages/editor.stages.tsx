"use client";
import { useURL } from "@/utils/hooks";
import { Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { TbProgressBolt } from "react-icons/tb";
import * as css from "./editor.stages.css";

export function EditorStages() {
  const url = useURL();
  const active = Number(url.searchParams.get("stage"));

  return (
    <section className={css.container}>
      <ol className={css.stageList}>
        {Array.from({ length: 3 }, (_, i) => (
          <StageItem key={i} active={i === active} index={i} />
        ))}
      </ol>
    </section>
  );
}

function StageItem({ index, active }: { index: number; active?: boolean }) {
  const url = useURL();
  url.searchParams.set("stage", String(index));

  return (
    <Text asChild type="label" className={css.stageItem({ active })}>
      <Link href={url}>
        <Icon.Custom>
          <TbProgressBolt />
        </Icon.Custom>
        Stage {1 + index}
      </Link>
    </Text>
  );
}
