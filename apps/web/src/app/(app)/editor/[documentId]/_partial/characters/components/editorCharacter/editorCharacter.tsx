"use client";
import { CharacterModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/characterModal";
import { GadgetModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/gadgetModal";
import type {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/actions";
import { useEditorEventHandler } from "@/modules/editor/features/events";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { createClient } from "@/utils/supabase/client";
import { Icon, Modal } from "@repo/ui/components";
import Image from "next/image";
import { RxQuestionMarkCircled } from "react-icons/rx";
import * as css from "./editorCharacter.css";

export interface EditorCharacterProps {
  data: BlueprintCharacterData;
  slots: CharacterGadgetSlotData[];
}

interface GadgetSlotProps {
  data: CharacterGadgetSlotData;
}

export function EditorCharacter({
  data: character,
  slots,
}: EditorCharacterProps) {
  const object = character.game_object;
  const active = object?.url != null;
  const color = character.player_slot?.color ?? "transparent";
  const eventHandler = useEditorEventHandler();

  async function updateToObject(object: GameObjectData | null) {
    return await createClient()
      .rpc("update_character_object", {
        character_id: character.id,
        object_id: object?.id ?? (null as any),
      })
      .throwOnError();
  }

  return (
    <Modal.Root>
      <article data-character-id={character.id} className={css.characterButton}>
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
        onUpdate={(newObject, oldObject) => {
          //? use to subscribe to postgres instead to avoid race conditions?
          const newData = { id: character.id, game_object: newObject };
          eventHandler.fire("updateCharacter", "user", newData);
          updateToObject(newObject).catch((e) => {
            console.error("Error updating character", e);
            newData.game_object = oldObject; // Revert back
            eventHandler.fire("updateCharacter", "foreign", newData);
          });
        }}
      />
    </Modal.Root>
  );
}

function GadgetSlot({ data: gadget }: GadgetSlotProps) {
  const eventHandler = useEditorEventHandler();
  const object = gadget.game_object;
  const active = object?.url != null;

  async function updateToObject(object: GameObjectData | null) {
    return createClient().rpc("update_gadget_object", {
      gadget_id: gadget.id,
      object_id: object?.id ?? (null as any),
    });
  }

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <button
          data-gadget-id={gadget.id}
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
        onUpdate={(newObject, oldObject) => {
          //? use to subscribe to postgres instead to avoid race conditions?
          const newData = { id: gadget.id, game_object: newObject };
          eventHandler.fire("updateGadget", "user", newData);
          updateToObject(newObject).catch((e) => {
            console.error("Error updating character", e);
            newData.game_object = oldObject; // Revert back
            eventHandler.fire("updateGadget", "foreign", newData);
          });
        }}
      />
    </Modal.Root>
  );
}
