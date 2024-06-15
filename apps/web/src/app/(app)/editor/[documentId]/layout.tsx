import {
  EditorCharacterData,
  EditorContextProvider,
} from "@/app/(app)/editor/[documentId]/_context";
import { FullPageEditorSpinner } from "@/app/(app)/editor/[documentId]/edit/page";
import {
  CharacterGadgetSlotData,
  getBlueprintCharacters,
  getCharacterGadgetSlots,
  getPlayerSlots,
} from "@/modules/blueprint/actions";
import { getBlueprint } from "@/modules/blueprint/actions/getBlueprint";
import { getBlueprintStages } from "@/modules/blueprint/actions/getBlueprintStages";
import { EditorEventHandler } from "@/modules/editor/features/events";
import { TeamContextProvider } from "@/modules/team/context";
import { SlotContextProvider } from "@/modules/team/modals/members/context";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import {
  EditorCharacters,
  EditorHeader,
  EditorSidepanelList,
} from "./_partial";
import {
  SidepanelItem,
  SidepanelMemberList,
} from "./_partial/panelList/components";
import { getTeamMember } from "./actions";
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
  const supabase = getServer(cookies());
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error("Unauthenticated");

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
  const [gadgetSlots, member, stages] = await Promise.all([
    getCharacterGadgetSlots(characters?.map((ch) => ch.id) ?? []),
    getTeamMember(user.data.user.id, blueprint?.id),
    getBlueprintStages(blueprint.id),
  ]);

  // Accumulate and index all characters and their appropriate gadgets
  const finalCharacters = {} as Record<number, EditorCharacterData>;
  characters.forEach((character) => {
    const finalGadgets = {} as Record<number, CharacterGadgetSlotData>;
    gadgetSlots.forEach((gadget) => {
      if (gadget.character_id !== character.id) return;
      finalGadgets[gadget.id] = gadget;
    });
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
        stages={stages ?? []}
        member={member}
        editable
        zoomable
        movable
        selectable
      >
        <TeamContextProvider teamId={blueprint.book.team.id}>
          <SlotContextProvider teamId={blueprint.book.team.id}>
            <div className={css.grid}>
              <EditorHeader />
              <EditorCharacters />
              <EditorSidepanelList side="right">
                <SidepanelItem title="Members">
                  <SidepanelMemberList />
                </SidepanelItem>
              </EditorSidepanelList>
              <div className={css.fadeInRect} />
              {children}
            </div>
          </SlotContextProvider>
        </TeamContextProvider>
      </EditorContextProvider>
    </EditorEventHandler>
  );
}
