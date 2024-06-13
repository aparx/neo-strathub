"use client";
import { EDITOR_RENDERERS } from "@/modules/editor/components/viewport";
import { GameObjectData, GameObjectType } from "@/modules/gameObject/hooks";
import { createCanvasNode } from "@repo/canvas";
import { Icon, ScrollArea, TextField } from "@repo/ui/components";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor } from "../../../../_context";
import * as css from "./objectList.css";

export interface SidepanelObjectListProps {
  type: GameObjectType;
}

export function SidepanelObjectList({ type }: SidepanelObjectListProps) {
  const [{ objectCache }] = useEditor();
  const [filter, setFilter] = useState<string>();
  const [minHeight, setMinHeight] = useState<number>();
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => searchRef.current?.focus(), []);

  const objects = useMemo(() => {
    const needle = filter?.trim().toLowerCase();
    return Object.values(objectCache).filter((obj) => {
      if (obj.type !== type) return false;
      if (!needle?.length) return true;
      return obj.name?.toLowerCase().includes(needle);
    });
  }, [objectCache, filter]);

  useEffect(() => {
    if (!containerRef.current) return;
    setMinHeight(containerRef.current.clientHeight);
  }, [objects]);

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
            {objects.map((object) => (
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

  return (
    <div data-obj-id={id} className={css.item({ loaded })}>
      <Image
        src={url}
        alt={name ?? "Object"}
        fill
        draggable={editable}
        onDragStart={() => {
          const defaultObjectSize = type === "gadget" ? 35 : 50;
          updateContext((oldContext) => ({
            ...oldContext,
            dragged: createCanvasNode(EDITOR_RENDERERS, "GameObject", {
              width: defaultObjectSize,
              height: defaultObjectSize,
              objectType: type,
              objectId: id,
            }),
          }));
        }}
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
