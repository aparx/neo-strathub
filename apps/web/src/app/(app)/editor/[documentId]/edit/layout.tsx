import React from "react";
import { EditorSidepanel } from "../_partial/sidepanel";

export default function EditorEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EditorSidepanel />
      {children}
    </>
  );
}
