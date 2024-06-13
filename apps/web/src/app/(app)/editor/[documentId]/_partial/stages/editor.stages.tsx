"use client";
import { useURL } from "@/utils/hooks";
import { Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RiStackFill, RiStackLine } from "react-icons/ri";
import * as css from "./editor.stages.css";

export function EditorStages() {
  const active = Number(useSearchParams().get("stage"));

  return (
    <section className={css.container}>
      <ol className={css.stageList}>
        {Array.from({ length: 4 }, (_, i) => (
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
    <Text asChild type="label" size="lg" className={css.stageItem({ active })}>
      <Link href={url}>
        <Icon.Custom>
          {active ? (
            <RiStackFill className={css.stageIconActive} />
          ) : (
            <RiStackLine />
          )}
        </Icon.Custom>
        <span className={css.stagePrefix}>Stage </span>
        {1 + index}
      </Link>
    </Text>
  );
}
