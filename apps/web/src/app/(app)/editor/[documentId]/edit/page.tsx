"use client";
import { useTeamContext } from "@/modules/team/context";
import { Spinner } from "@repo/ui/components";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useEditorContext } from "../_context";
import * as css from "./page.css";

export default function EditorEditPage() {
  const [{ stages, blueprint }, updateEditor] = useEditorContext();
  const [{ updatePresence }] = useTeamContext();
  const searchParams = useSearchParams();
  const showIndex = Number(searchParams.get("stage")) || -1;
  const stageData = useMemo(
    () =>
      stages.map((x, i) => ({
        id: x.id,
        shown: (i === 0 && showIndex < 0) || x.index === showIndex,
      })),
    [stages, showIndex],
  );

  useEffect(() => {
    updatePresence({ documentId: blueprint.id, status: "online" });
    updateEditor((oldContext) => ({
      ...oldContext,
      editable: true,
      selectable: true,
    }));
  }, []);

  return <EditorWindow stages={stageData} />;
}

const EditorWindow = dynamic(
  async () => (await import("../window")).EditorWindow,
  {
    loading: () => <FullPageEditorSpinner />,
    ssr: false,
  },
);

// TODO this needs to be moved to a separate component, to be exported
export function FullPageEditorSpinner() {
  return (
    <div className={css.loadingContainer}>
      <Spinner size={"2em"} />
    </div>
  );
}
