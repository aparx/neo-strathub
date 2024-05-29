"use client";
import { Text } from "@repo/ui/components";
import * as css from "./editor.inspector.css.ts";

export function EditorInspector() {
  // TODO canvas context, that contains the actual context for selected elements
  return (
    <Text asChild>
      <aside className={css.inspectorContainer}>Inspector</aside>
    </Text>
  );
}
