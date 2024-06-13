"use client";
import * as css from "./editor.panelList.css";

export function EditorSidepanelList({
  children,
  side,
}: {
  children: React.ReactNode;
  side: css.PanelListSide;
}) {
  return <section className={css.panelList({ side })}>{children}</section>;
}
