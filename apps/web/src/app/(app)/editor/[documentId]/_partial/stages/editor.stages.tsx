"use client";
import { useURL } from "@/utils/hooks";
import { Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RiStackFill, RiStackLine } from "react-icons/ri";
import { useEditor } from "../../_context";
import * as css from "./editor.stages.css";

export function EditorStages() {
  const [{ stages }] = useEditor();
  const active = Number(useSearchParams().get("stage"));

  return (
    <section className={css.container}>
      <ol className={css.stageList}>
        {stages.map((stage) => (
          <StageItem
            key={stage.id}
            active={stage.index === active}
            index={stage.index}
          />
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
