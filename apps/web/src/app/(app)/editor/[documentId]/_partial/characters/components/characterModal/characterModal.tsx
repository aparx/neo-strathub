"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintCharacterData } from "@/modules/blueprint/characters/actions";
import { useFetchObjects } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Icon, Modal, TextField } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
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
  const [filter, setFilter] = useState<string>();
  const debounceFilter = useDebounceCallback(setFilter, 250);
  const editorContext = useEditorContext();

  // Fetch game objects
  const { data, isLoading } = useFetchObjects({
    name: filter,
    type: "character",
    gameId: editorContext.blueprint.arena.game_id,
  });

  const searchFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchFieldRef.current?.focus();
  }, []);

  return (
    <section className={css.gridContainer}>
      <header className={css.gridHeader}>
        <search style={{ marginLeft: "auto" }}>
          <TextField
            ref={searchFieldRef}
            leading={<Icon.Mapped type={"search"} color={"red"} />}
            placeholder={"Search"}
            onInput={(e) => debounceFilter(e.currentTarget.value)}
          />
        </search>
      </header>
      <div className={css.charGrid}>
        {data?.data?.map((x) => (
          <CharacterGridItem
            key={x.id}
            url={x.url}
            name={x.name ?? `${x.id}`}
          />
        ))}
      </div>
    </section>
  );
}

function CharacterGridItem({
  url,
  name,
  active,
  onSelect,
}: {
  url: string;
  name: string;
  active?: boolean;
  onSelect?: () => any;
}) {
  return (
    <button onClick={onSelect} className={css.charGridItem({ active })}>
      <Image src={url} alt={name} fill style={{ objectFit: "contain" }} />
    </button>
  );
}
