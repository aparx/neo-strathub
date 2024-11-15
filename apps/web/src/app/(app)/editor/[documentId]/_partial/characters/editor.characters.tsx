"use client";
import { EditorCharacter } from "@/app/(app)/editor/[documentId]/_partial/characters/components/editorCharacter";
import { BlueprintCharacterData } from "@/modules/blueprint/actions";
import { useMemo } from "react";
import { useEditorContext } from "../../_context";
import * as css from "./editor.characters.css";

export function EditorCharacters() {
  const [{ characters: characterMap }] = useEditorContext();

  return (
    <ol className={css.list} aria-label={"Picked Characters"}>
      {useMemo(() => {
        const characters = Object.values(characterMap);
        if (!characters.length)
          throw new Error("There should be at least one character");
        return characters.map((character) => (
          <li key={character.id}>
            <Character {...character} />
          </li>
        ));
      }, [characterMap])}
    </ol>
  );
}

function Character(character: BlueprintCharacterData) {
  const [{ characters: characterMap }] = useEditorContext();
  const slotsMap = characterMap[character.id]?.gadgets ?? {};
  const slots = useMemo(() => Object.values(slotsMap), [slotsMap]);
  return <EditorCharacter data={character} slots={slots} />;
}
