"use client";
import { GameObjectData, GameObjectType } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Icon, Modal, TextField } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import Image from "next/image";
import {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "../../../../_context";
import * as css from "./objectGrid.css";

export function ObjectGrid({
  activeObjectId,
  setActiveObject,
  type,
}: {
  activeObjectId: GameObjectData["id"] | Nullish;
  setActiveObject: (object: GameObjectData | null) => void;
  type: GameObjectType;
}) {
  const [filter, setFilter] = useState<string>();
  const gridShellRef = useRef<HTMLDivElement>(null);
  const searchFieldRef = useRef<HTMLInputElement>(null);
  const [{ objectCache }] = useEditorContext();

  // Fetch game objects
  const objects = useMemo(() => {
    const needle = filter?.toLowerCase();
    return Object.values(objectCache).filter((object) => {
      if (object.type !== type) return false;
      return !needle || object.name?.toLowerCase().includes(needle);
    });
  }, [objectCache]);

  const [gridHeight, setGridHeight] = useState<number>();

  useEffect(() => {
    const gridHeight = gridShellRef.current?.clientHeight;
    setGridHeight((oldHeight) => Math.max(gridHeight ?? 0, oldHeight ?? 0));
  }, [objects]);

  useEffect(() => searchFieldRef.current?.focus(), []);

  return (
    <section className={css.gridRoot}>
      <header className={css.gridHeader}>
        <search style={{ marginLeft: "auto" }}>
          <TextField
            ref={searchFieldRef}
            leading={<Icon.Mapped type={"search"} color={"red"} />}
            placeholder={"Search"}
            onInput={(e) => setFilter(e.currentTarget.value)}
          />
        </search>
      </header>
      <div
        ref={gridShellRef}
        className={css.gridContainer}
        style={{ height: gridHeight }}
      >
        <div className={css.gridContent}>
          {objects?.length === 0 && (
            <div className={css.noneFound} aria-live={"assertive"}>
              No object found for given query
            </div>
          )}
          {objects?.length !== 0 && (
            <GridItem
              style={{ background: vars.colors.accents[4] }}
              active={activeObjectId == null}
              onClick={() => setActiveObject(null)}
            >
              <div className={css.emptyLine} />
            </GridItem>
          )}
          {objects?.map((object) => (
            <GridItem
              key={object.id}
              active={object.id === activeObjectId}
              onClick={() => setActiveObject(object)}
            >
              <Image
                src={object.url}
                alt={object.name ?? "Game object"}
                fill
                style={{ objectFit: "contain" }}
              />
            </GridItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function GridItem({
  children,
  active,
  style,
  ...restProps
}: ComponentPropsWithoutRef<"button"> & {
  active?: boolean;
}) {
  return (
    <Modal.Close
      className={css.gridItem}
      style={{
        background: active ? vars.colors.primary.darker : undefined,
        ...style,
      }}
      {...restProps}
    >
      {children}
    </Modal.Close>
  );
}
