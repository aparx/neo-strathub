import { EDITOR_RENDERERS } from "@/modules/editor/components/viewport";
import {
  GameObjectData,
  UseFetchObjectsFilters,
  useFetchObjects,
} from "@/modules/gameObject/hooks";
import { createCanvasNode } from "@repo/canvas";
import { Icon, ScrollArea, TextField } from "@repo/ui/components";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "../../../../_context";
import * as css from "./objectList.css";

export interface SidepanelObjectListProps {
  type: UseFetchObjectsFilters["type"];
}

export function SidepanelObjectList({ type }: SidepanelObjectListProps) {
  const [{ blueprint }] = useEditor();
  const [filter, setFilter] = useState<string>();
  const [minHeight, setMinHeight] = useState<number>();
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => searchRef.current?.focus(), []);

  const { data: haystack } = useFetchObjects({
    gameId: blueprint.arena.game_id,
    type,
  });

  const objects = useMemo(() => {
    const needle = filter?.trim()?.toLowerCase();
    if (!needle?.length) return haystack;
    return haystack?.filter((obj) => {
      if (!obj.name) return true;
      return obj.name.toLowerCase().includes(needle);
    });
  }, [haystack, filter]);

  useEffect(() => {
    if (!containerRef.current) return;
    setMinHeight(containerRef.current.clientHeight);
  }, [haystack]);

  return (
    <div
      ref={containerRef}
      className={css.container}
      onMouseEnter={() => searchRef.current?.focus()}
      onMouseLeave={() => searchRef.current?.blur()}
      style={{ minHeight }}
    >
      <TextField
        ref={searchRef}
        className={css.margin}
        placeholder="Search"
        value={filter}
        leading={<Icon.Mapped type="search" />}
        onInput={(e) => setFilter(e.currentTarget.value)}
      />
      <ScrollArea.Root style={{ maxHeight: 245, overflow: "hidden" }}>
        <ScrollArea.Content>
          <ul className={css.list}>
            {objects?.map((object) => (
              <li key={object.id}>
                <PanelGameObject {...object} />
              </li>
            ))}
          </ul>
        </ScrollArea.Content>
      </ScrollArea.Root>
    </div>
  );
}

function PanelGameObject({ id, url, name, type }: GameObjectData) {
  const [{ editable }, updateContext] = useEditor();
  const [loaded, setLoaded] = useState(false);

  function createNode() {
    // TODO creates an actual game node object
    return createCanvasNode(EDITOR_RENDERERS, "GameObject", {
      width: 50,
      height: 50,
      objectType: type,
      objectId: id,
    });
  }

  return (
    <div data-obj-id={id} className={css.item({ loaded })}>
      <Image
        src={url}
        alt={name ?? "Object"}
        fill
        draggable={editable}
        onDragStart={() =>
          updateContext((oldContext) => ({
            ...oldContext,
            dragged: createNode(),
          }))
        }
        onDragEnd={() =>
          updateContext((oldContext) => ({
            ...oldContext,
            dragged: undefined,
          }))
        }
        onLoad={() => setLoaded(true)}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}