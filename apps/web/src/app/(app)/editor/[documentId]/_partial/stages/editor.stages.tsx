"use client";
import { useEditorEvent } from "@/modules/editor/features/events/hooks";
import { useURL } from "@/utils/hooks";
import { Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiStackFill, RiStackLine } from "react-icons/ri";
import { useEditorContext } from "../../_context";
import * as css from "./editor.stages.css";

export function EditorStages() {
  const url = useURL();
  const router = useRouter();
  const [{ stages }] = useEditorContext();
  const active = Number(url.searchParams.get("stage"));

  useEditorEvent("keyPress", (e) => {
    if (e.event.event.repeat) return;
    const isBack = e.event.keys.includes("stageBack");
    const isNext = e.event.keys.includes("stageNext");
    const delta = isNext ? 1 : isBack ? -1 : 0;
    if (delta === 0) return;
    e.preventDefault();
    const newIndex = Math.max(0, Math.min(active + delta, stages.length - 1));
    url.searchParams.set("stage", String(newIndex));
    router.replace(url.href);
  });

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
