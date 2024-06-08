import { Icon, ScrollArea, TextField } from "@repo/ui/components";
import { useEffect, useRef } from "react";
import * as css from "./objectList.css";

export function SidepanelObjectList() {
  // TODO fetch all the objects available for given blueprint
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => searchRef.current?.focus(), []);

  return (
    <div
      className={css.container}
      onMouseEnter={() => searchRef.current?.focus()}
    >
      <TextField
        ref={searchRef}
        className={css.margin}
        leading={<Icon.Mapped type="search" />}
        placeholder="Search"
      />
      <ScrollArea.Root style={{ maxHeight: 245, overflow: "hidden" }}>
        <ScrollArea.Content>
          <ul className={css.list}>
            {Array.from({ length: 100 }, (_, i) => (
              <PanelGameObject key={i} />
            ))}
          </ul>
        </ScrollArea.Content>
      </ScrollArea.Root>
    </div>
  );
}

function PanelGameObject() {
  return <div className={css.item} />;
}
