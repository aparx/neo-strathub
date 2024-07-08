"use client";
import { useEffect } from "react";
import { useEditorContext } from "../_context";

export default function EditorPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, updateContext] = useEditorContext();

  useEffect(() => {
    updateContext((old) => ({ ...old, mode: "preview" }));
  }, []);

  return <>{children}</>;
}
