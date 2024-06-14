"use client";
import { CharacterModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/characterModal";
import { GadgetModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components/gadgetModal";
import type {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/actions";
import { EDITOR_RENDERERS } from "@/modules/editor/components/viewport";
import {
  EditorEventMap,
  useEditorEventHandler,
} from "@/modules/editor/features/events";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { createClient } from "@/utils/supabase/client";
import { createCanvasNode } from "@repo/canvas";
import { Icon, Modal } from "@repo/ui/components";
import Image from "next/image";
import { useRef } from "react";
import { PiSelectionSlashBold } from "react-icons/pi";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useEditorContext } from "../../../../_context";
import * as css from "./editorCharacter.css";

export interface EditorCharacterProps {
  data: BlueprintCharacterData;
  slots: CharacterGadgetSlotData[];
}

interface GadgetSlotProps {
  data: CharacterGadgetSlotData;
  characterId: number;
}

export function EditorCharacter({
  data: character,
  slots,
}: EditorCharacterProps) {
  const [{ channel, editable }, updateEditor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const object = character.game_object;
  const active = object?.url != null;
  const color = character.player_slot?.color ?? "transparent";

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
      <div data-character-id={character.id} className={css.characterButton}>
        <Modal.Trigger asChild>
          <button
            className={css.characterBox({ active, editable })}
            style={{ boxShadow: `inset 0 0 0 2px ${color}` }}
            disabled={!editable}
            draggable={!!object}
            onDragStart={() => {
              updateEditor((old) => ({
                ...old,
                dragged: createCanvasNode(EDITOR_RENDERERS, "GameObject", {
                  width: 50,
                  height: 50,
                  objectId: object?.id,
                  objectType: "character",
                  linkToAssignee: true,
                  characterId: character.id,
                }),
              }));
            }}
          >
            {object ? (
              <Image
                src={object.url}
                alt={object.name ?? String(object.id)}
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
              <GadgetSlot
                key={gadget.id}
                data={gadget}
                characterId={character.id}
              />
            </li>
          ))}
        </ol>
      </div>
      <CharacterModal
        character={character}
        onUpdate={(newObject, oldObject) => {
          //? use to subscribe to postgres instead to avoid race conditions?
          const eventData = { id: character.id, game_object: newObject };
          eventHandler.fire("updateCharacter", "user", eventData);
          channel.broadcast("updateCharacter", eventData);
          updateToObject(newObject).catch((e) => {
            console.error("Error updating character", e);
            eventData.game_object = oldObject; // Revert back
            eventHandler.fire("updateCharacter", "foreign", eventData);
          });
        }}
      />
    </Modal.Root>
  );
}

function GadgetSlot({ data: gadget, characterId }: GadgetSlotProps) {
  const [{ channel, editable }, updateEditor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const object = gadget.game_object;
  const active = object?.url != null;
  const imageRef = useRef<HTMLImageElement>(null);

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
          disabled={!editable}
          data-gadget-id={gadget.id}
          className={css.gadgetBox({ empty: !active && !editable, editable })}
          draggable={editable && active}
          onDragStart={(e) =>
            updateEditor((o) => ({
              ...o,
              dragged: createCanvasNode(EDITOR_RENDERERS, "GameObject", {
                objectId: gadget.game_object?.id,
                objectType: "gadget",
                width: imageRef.current?.clientWidth ?? 50,
                height: imageRef.current?.clientHeight ?? 50,
                characterId: characterId,
              }),
            }))
          }
          onDragEnd={() => updateEditor((o) => ({ ...o, dragged: undefined }))}
        >
          {active ? (
            <Image
              ref={imageRef}
              src={object.url}
              alt={object.name ?? "Gadget"}
              fill
              style={{ objectFit: "contain" }}
            />
          ) : editable ? (
            <Icon.Mapped type={"add"} />
          ) : (
            <Icon.Custom>
              <PiSelectionSlashBold />
            </Icon.Custom>
          )}
        </button>
      </Modal.Trigger>
      <GadgetModal
        gadget={gadget}
        onUpdate={(newObject, oldObject) => {
          //? use to subscribe to postgres instead to avoid race conditions?
          const eventData = {
            ...gadget,
            game_object: newObject,
            character_id: characterId,
          } satisfies EditorEventMap["updateGadget"];
          eventHandler.fire("updateGadget", "user", eventData);
          channel.broadcast("updateGadget", eventData);
          updateToObject(newObject).catch((e) => {
            console.error("Error updating gadget", e);
            eventData.game_object = oldObject; // Revert back
            eventHandler.fire("updateGadget", "foreign", eventData);
          });
        }}
      />
    </Modal.Root>
  );
}
