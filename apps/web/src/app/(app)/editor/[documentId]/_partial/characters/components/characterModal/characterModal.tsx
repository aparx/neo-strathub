"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { BlueprintCharacterData } from "@/modules/blueprint/characters/actions";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Modal } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";
import { ObjectGrid } from "../objectGrid";

export function CharacterModal({
  character,
  onSave,
}: {
  character: SharedState<BlueprintCharacterData>;
  onSave: (object: GameObjectData | null) => Promise<boolean>;
}) {
  const { blueprint, channel } = useEditorContext();

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
      <ObjectGrid
        filters={{ type: "character", gameId: blueprint.arena.game_id }}
        activeObjectId={character.state.game_object?.id}
        setActiveObject={async (newObject) => {
          const characterBefore = character.state;
          const newChar = { ...character.state, game_object: newObject };
          character.update(newChar);

          const handleError = () => character.update(characterBefore);
          const result = await onSave(newObject).catch(handleError);
          if (result) channel.broadcast("updateCharacter", newChar);
          else handleError();
        }}
      />
    </Modal.Content>
  );
}
