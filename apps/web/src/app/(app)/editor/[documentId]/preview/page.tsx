"use client";
import { useTeamContext } from "@/modules/team/context";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useEditorContext } from "../_context";

export default function EditorPreviewPage() {
  const [{ stages, blueprint }, updateEditor] = useEditorContext();
  const [{ updatePresence }] = useTeamContext();
  const stageData = useMemo(
    () =>
      stages.map((x) => ({
        id: x.id,
        shown: true,
      })),
    [stages],
  );

  useEffect(() => {
    updatePresence({ documentId: blueprint.id, status: "online" });
    updateEditor((oldContext) => ({
      ...oldContext,
      selectable: false,
      editable: false,
    }));
  }, []);

  return <EditorWindow stages={stageData} />;
}

const EditorWindow = dynamic(
  async () => (await import("../window")).EditorWindow,
  {
    ssr: false,
  },
);
