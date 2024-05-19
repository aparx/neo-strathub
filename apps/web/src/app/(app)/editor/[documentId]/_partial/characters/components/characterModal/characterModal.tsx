"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintCharacterData } from "@/modules/blueprint/characters/actions";
import { useFetchObjects } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Icon, Modal, TextField } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import * as css from "./characterModal.css";

export function CharacterModal({
  character,
}: {
  character: SharedState<BlueprintCharacterData>;
}) {
  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <span>
          Manage character{" "}
          <span style={{ color: vars.colors.emphasis.medium }}>
            #{1 + character.state.index}
          </span>
        </span>
        <Modal.Exit />
      </Modal.Title>
      <ChooseCharacterGrid character={character} />
    </Modal.Content>
  );
}

function ChooseCharacterGrid({
  character,
}: {
  character: SharedState<BlueprintCharacterData>;
}) {
  const editorContext = useEditorContext();
  const [filter, setFilter] = useState<string>();
  const gridRef = useRef<HTMLDivElement>(null);
  const searchFieldRef = useRef<HTMLInputElement>(null);

  // Fetch game objects
  const { data, isLoading } = useFetchObjects({
    type: "character",
    gameId: editorContext.blueprint.arena.game_id,
  });

  const [objects, setObjects] = useState(data?.data);
  const [gridHeight, setGridHeight] = useState<number>();

  // Disable height limitation and allow for resize when data changes
  useEffect(() => setGridHeight(undefined), [data]);

  // Apply the actual filter by updating the to-be-displayed objects
  useEffect(() => {
    const needle = filter?.toLowerCase();
    const haystack = data?.data ?? [];
    if (!needle?.length) return setObjects(haystack);
    setGridHeight(gridRef.current?.clientHeight); // Keep height on filter change
    setObjects(haystack.filter((x) => x.name?.toLowerCase().includes(needle)));
  }, [data, filter]);

  const displayObjects = useMemo(() => {
    if (!objects?.length) return undefined;
    const active = character.state.game_object?.id;
    if (!active) return objects;
    const index = objects.findIndex((x) => x.id === active);
    if (index === -1) return objects;
    // Swap first with the currently active element
    const tmp = objects[index];
    objects[index] = objects[0];
    objects[0] = tmp;
    return objects;
  }, [objects]);

  useEffect(() => searchFieldRef.current?.focus(), []);

  return (
    <section className={css.gridContainer}>
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
        className={css.charGrid}
        ref={gridRef}
        style={{ height: gridHeight }}
      >
        {displayObjects?.length === 0 && (
          <div className={css.noneFound} aria-live={"assertive"}>
            No character found for given query
          </div>
        )}
        {displayObjects?.map((x) => (
          <CharacterGridItem
            key={x.id}
            {...x}
            active={character.state.game_object?.id === x.id}
            onSelect={() =>
              character.update((prev) => ({
                ...prev,
                game_object: x,
              }))
            }
          />
        ))}
      </div>
    </section>
  );
}

function CharacterGridItem({
  id,
  url,
  name,
  active,
  onSelect,
}: BlueprintCharacterData["game_object"] & {
  active?: boolean;
  onSelect?: () => any;
}) {
  return (
    <Modal.Close
      data-char-id={id}
      onClick={onSelect}
      className={css.charGridItem({ active })}
      disabled={active}
    >
      <Image
        src={url}
        alt={name ?? String(id)}
        fill
        style={{ objectFit: "contain" }}
      />
    </Modal.Close>
  );
}
