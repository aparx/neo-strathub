import {
  EditorCharacterData,
  EditorContextProvider,
} from "@/app/(app)/editor/[documentId]/_context";
import {
  EditorCharacters,
  EditorHeader,
} from "@/app/(app)/editor/[documentId]/_partial";
import { FullPageEditorSpinner } from "@/app/(app)/editor/[documentId]/page";
import {
  CharacterGadgetSlotData,
  getBlueprintCharacters,
  getCharacterGadgetSlots,
  getPlayerSlots,
} from "@/modules/blueprint/actions";
import { getBlueprint } from "@/modules/blueprint/actions/getBlueprint";
import { EditorEventHandler } from "@/modules/editor/features/events";
import React, { Suspense } from "react";
import { EditorSidepanel } from "./_partial/sidepanel";
import * as css from "./layout.css";

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { documentId: string };
}) {
  return (
    <Suspense fallback={<FullPageEditorSpinner />}>
      <Content documentId={params.documentId}>{children}</Content>
    </Suspense>
  );
}

async function Content({
  children,
  documentId,
}: {
  children: React.ReactNode;
  documentId: string;
}) {
  console.time("START");
  const [blueprintQuery, characters] = await Promise.all([
    getBlueprint(documentId),
    getBlueprintCharacters(documentId),
  ]);

  const document = await getBlueprint(documentId);
  if (blueprintQuery.state === "error")
    throw new Error(blueprintQuery.error.message);
  const blueprint = document.data;
  if (!blueprint) throw new Error("Could not find blueprint");

  // Query all player slots & gadget slots of all characters
  const playerSlots = await getPlayerSlots(blueprint.book.team.id);
  const gadgetSlots = await Promise.allSettled(
    characters.map(({ id }) => getCharacterGadgetSlots(id)),
  );

  // Accumulate and index all characters and their appropriate gadgets
  const finalCharacters = {} as Record<number, EditorCharacterData>;
  characters.map((character, index) => {
    const gadgetSlot = gadgetSlots[index];
    const gadgets = gadgetSlot?.status === "fulfilled" ? gadgetSlot.value : [];
    const finalGadgets = {} as Record<number, CharacterGadgetSlotData>;
    gadgets.forEach((gadget) => (finalGadgets[gadget.id] = gadget));
    finalCharacters[character.id] = {
      ...character,
      gadgets: finalGadgets,
    };
  });

  return (
    <EditorEventHandler>
      <EditorContextProvider
        blueprint={blueprint}
        characters={finalCharacters}
        slots={playerSlots ?? []}
      >
        <div className={css.content}>
          <EditorHeader />
          <EditorSidepanel />
          <EditorCharacters />
          {/*<EditorInspector />*/}
          <main>{children}</main>
        </div>
      </EditorContextProvider>
    </EditorEventHandler>
  );
}
