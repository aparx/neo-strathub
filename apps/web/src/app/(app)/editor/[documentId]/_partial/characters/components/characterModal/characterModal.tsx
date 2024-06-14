"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import type { BlueprintCharacterData } from "@/modules/blueprint/actions";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Modal } from "@repo/ui/components";
import { ObjectGrid } from "../objectGrid";

export function CharacterModal({
  character,
  onUpdate,
}: {
  character: BlueprintCharacterData;
  onUpdate: (
    newObject: GameObjectData | null,
    oldObject: GameObjectData | null,
  ) => any;
}) {
  const [{ blueprint }] = useEditorContext();

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <span>
          Manage character{" "}
          <span style={{ color: vars.colors.emphasis.medium }}>
            #{1 + character.index}
          </span>
        </span>
        <Modal.Exit />
      </Modal.Title>
      <ObjectGrid
        gameId={blueprint.arena.game_id}
        type="character"
        activeObjectId={character.game_object?.id}
        setActiveObject={async (newObject) => {
          onUpdate(newObject, character.game_object);
        }}
      />
    </Modal.Content>
  );
}
