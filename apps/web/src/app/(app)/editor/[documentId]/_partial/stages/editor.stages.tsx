"use client";
import { useURL } from "@/utils/hooks";
import { Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RiStackFill, RiStackLine } from "react-icons/ri";
import { useEditorContext } from "../../_context";
import * as css from "./editor.stages.css";

export function EditorStages() {
  const [{ stages }] = useEditorContext();
  const active = Number(useSearchParams().get("stage"));

  return (
    <section className={css.container}>
      <ol className={css.stageList} aria-label="Stages">
        {stages.map((stage) => (
          <li key={stage.id}>
            <StageItem active={stage.index === active} index={stage.index} />
          </li>
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
      <Link href={url} replace>
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
