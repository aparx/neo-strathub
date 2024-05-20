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
  onSave: (object: GameObjectData | null) => Promise<any>;
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
          const beforeCharacter = character.state;
          const newCharacter = { ...character.state, game_object: newObject };
          character.update(newCharacter);
          onSave(newObject)
            .then(() => channel.broadcast("updateCharacter", newCharacter))
            .catch(() => character.update(beforeCharacter) /* TODO sync */);
        }}
      />
    </Modal.Content>
  );
}
