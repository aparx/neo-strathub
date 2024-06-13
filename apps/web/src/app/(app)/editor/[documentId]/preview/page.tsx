"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useEditor } from "../_context";

export default function EditorPreviewPage() {
  const [{ stages }] = useEditor();
  const stageData = useMemo(
    () =>
      stages.map((x) => ({
        id: x.id,
        shown: true,
      })),
    [stages],
  );

  return <EditorWindow stages={stageData} />;
}

const EditorWindow = dynamic(
  async () => (await import("../window")).EditorWindow,
  {
    ssr: false,
  },
);
