"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { CharacterModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/characterModal";
import { GadgetModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/gadgetModal";
import { useRealtimeEditorHandle } from "@/app/(app)/editor/[documentId]/_utils";
import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/characters/actions";
import { createClient } from "@/utils/supabase/client";
import { Icon, Modal } from "@repo/ui/components";
import { useSharedState } from "@repo/utils/hooks";
import Image from "next/image";
import { useEffect } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import * as css from "./editorCharacter.css";

export interface EditorCharacterProps {
  data: BlueprintCharacterData;
  slots: CharacterGadgetSlotData[];
}

interface GadgetSlotProps {
  data: CharacterGadgetSlotData;
}

export function EditorCharacter({ data, slots }: EditorCharacterProps) {
  const ctx = useEditorContext();
  const character = useSharedState(data);
  const object = character.state.game_object;
  const active = object?.url != null;
  const color = character.state.team_player_slot?.color ?? "transparent";

  useRealtimeEditorHandle(ctx.channel, "updateCharacter", async (payload) => {
    if (payload.id === data.id)
      character.update((prev) => ({ ...prev, ...payload }));
  });

  return (
    <Modal.Root>
      <article
        data-character-id={character.state.id}
        className={css.characterButton}
      >
        <Modal.Trigger asChild>
          <button
            className={css.characterBox({ active })}
            style={{ boxShadow: `inset 0 0 0 2px ${color}` }}
          >
            {object ? (
              <Image
                src={object.url}
                alt={object.name ?? "Game object"}
                fill
                className={css.characterImage}
              />
            ) : (
              <RxQuestionMarkCircled size={"1em"} />
            )}
          </button>
        </Modal.Trigger>
        <ol className={css.gadgetList}>
          {slots.map((gadget) => (
            <li key={gadget.id}>
              <GadgetSlot key={gadget.id} data={gadget} />
            </li>
          ))}
        </ol>
      </article>
      <CharacterModal
        character={character}
        onSave={async (obj) =>
          await createClient()
            .from("blueprint_character")
            .update({ object_id: obj?.id ?? null })
            .eq("id", data.id)
            .throwOnError()
        }
      />
    </Modal.Root>
  );
}

function GadgetSlot({ data }: GadgetSlotProps) {
  const { channel } = useEditorContext();
  const gadget = useSharedState(data);
  const object = gadget.state.game_object;
  const active = object?.url != null;

  useEffect(() => {
    channel.register("updateGadget", (payload) => {
      if (payload.id === data.id) gadget.update(payload);
    });
  }, []);

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <button
          data-gadget-id={data.id}
          className={css.gadgetBox({ active: false })}
        >
          {active ? (
            <Image
              src={object.url}
              alt={object.name ?? "Gadget"}
              fill
              style={{ objectFit: "contain" }}
            />
          ) : (
            <Icon.Mapped type={"add"} />
          )}
        </button>
      </Modal.Trigger>
      <GadgetModal
        gadget={gadget}
        onSave={async (obj) =>
          console.log(
            await createClient()
              .from("character_gadget")
              .update({ object_id: obj?.id ?? null })
              .eq("id", data.id)
              .throwOnError(),
          )
        }
      />
    </Modal.Root>
  );
}
