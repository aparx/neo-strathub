"use client";
import { CharacterData } from "@/app/(app)/editor/[documentId]/_partial";
import { vars } from "@repo/theme";
import { Icon, Modal, TextField } from "@repo/ui/components";
import { useEffect, useRef } from "react";
import * as css from "./characters.modal.css";

export function ManageCharacterModal({
  index,
  game_object,
  team_player_slot,
}: CharacterData) {
  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <span>
          Manage character{" "}
          <span style={{ color: vars.colors.emphasis.medium }}>
            #{1 + index}
          </span>
        </span>
        <Modal.Exit />
      </Modal.Title>
      <ChooseCharacterGrid />
    </Modal.Content>
  );
}

function ChooseCharacterGrid() {
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
          />
        </search>
      </header>
      <div className={css.charGrid}>
        {new Array(50).fill(<button className={css.charGridItem} />)}
      </div>
    </section>
  );
}
