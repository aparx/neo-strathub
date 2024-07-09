"use client";
import { Slot } from "@/modules/team/modals/settings/components/settingField/settingField";
import * as css from "./editor.panelList.css";

export function EditorSidepanelList({
  children,
  side,
  asChild,
}: {
  children: React.ReactNode;
  side: css.PanelListSide;
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : "div";
  return <Component className={css.panelList({ side })}>{children}</Component>;
}
