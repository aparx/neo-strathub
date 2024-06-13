"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useEditor } from "../_context";

export default function EditorPreviewPage() {
  const [{ stages }, updateEditor] = useEditor();
  const stageData = useMemo(
    () =>
      stages.map((x) => ({
        id: x.id,
        shown: true,
      })),
    [stages],
  );

  useEffect(() => {
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
