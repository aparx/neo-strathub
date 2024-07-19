"use client";
import React, { useEffect } from "react";
import { useEditorContext } from "../_context";
import { EditorSidepanelList, EditorStages } from "../_partial";
import {
  SidepanelItem,
  SidepanelObjectList,
  SidepanelShapeList,
} from "../_partial/panelList/components";

export default function EditorEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, updateContext] = useEditorContext();

  useEffect(() => {
    updateContext((old) => ({ ...old, mode: "edit" }));
  }, []);

  return (
    <>
      <EditorSidepanelList side="left">
        <SidepanelItem title="Shapes">
          <SidepanelShapeList />
        </SidepanelItem>
        <SidepanelItem title="Gadgets">
          <SidepanelObjectList type="gadget" />
        </SidepanelItem>
        <SidepanelItem title="Characters">
          <SidepanelObjectList type="character" />
        </SidepanelItem>
      </EditorSidepanelList>
      <EditorStages />
      {children}
    </>
  );
}
