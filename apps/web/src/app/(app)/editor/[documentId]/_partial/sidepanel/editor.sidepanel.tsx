"use client";
import { SidepanelItem, SidepanelObjectList } from "./components";
import * as css from "./editor.sidepanel.css";

export function EditorSidepanel() {
  return (
    <section className={css.sidepanel}>
      <SidepanelItem title="Gadgets">
        <SidepanelObjectList type="gadget" />
      </SidepanelItem>
      <SidepanelItem title="Characters">
        <SidepanelObjectList type="character" />
      </SidepanelItem>
    </section>
  );
}
