import React from "react";
import { EditorSidepanelList, EditorStages } from "../_partial";
import {
  SidepanelItem,
  SidepanelObjectList,
} from "../_partial/panelList/components";

export default function EditorEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EditorSidepanelList side="left">
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
