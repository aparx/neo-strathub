import {
  GameObjectData,
  useFetchObjects,
  UseFetchObjectsFilters,
} from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Icon, Modal, TextField } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import Image from "next/image";
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import * as css from "./objectGrid.css";

export function ObjectGrid({
  activeObjectId,
  setActiveObject,
  filters,
}: {
  activeObjectId: GameObjectData["id"] | Nullish;
  setActiveObject: (object: GameObjectData | null) => void;
  filters: UseFetchObjectsFilters;
}) {
  const [filter, setFilter] = useState<string>();
  const gridShellRef = useRef<HTMLDivElement>(null);
  const searchFieldRef = useRef<HTMLInputElement>(null);

  // Fetch game objects
  const { data, isLoading } = useFetchObjects(filters);

  const [objects, setObjects] = useState(data?.data);
  const [gridHeight, setGridHeight] = useState<number>();

  // Disable height limitation and allow for resize when data changes
  useEffect(() => setGridHeight(undefined), [data]);

  // Apply the actual filter by updating the to-be-displayed objects
  useEffect(() => {
    const needle = filter?.toLowerCase();
    const haystack = data?.data ?? [];
    if (!needle?.length) return setObjects(haystack);
    setGridHeight(gridShellRef.current?.clientHeight);
    setObjects(haystack.filter((x) => x.name?.toLowerCase().includes(needle)));
  }, [data, filter]);

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
