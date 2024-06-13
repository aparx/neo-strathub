import React from "react";
import { EditorStages } from "../_partial";
import { EditorSidepanel } from "../_partial/sidepanel";

export default function EditorEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EditorSidepanel />
      <EditorStages />
      {children}
    </>
  );
}
