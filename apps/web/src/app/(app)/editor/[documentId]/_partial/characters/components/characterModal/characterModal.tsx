"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { ObjectGrid } from "@/app/(app)/editor/[documentId]/_partial/characters/components/objectGrid";
import { BlueprintCharacterData } from "@/modules/blueprint/characters/actions";
import { vars } from "@repo/theme";
import { Modal } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";

export function CharacterModal({
  character,
}: {
  character: SharedState<BlueprintCharacterData>;
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
        setActiveObject={(newObject) => {
          character.update((prev) => {
            const newCharacter = { ...prev, game_object: newObject };
            channel.broadcast("updateCharacter", newCharacter);
            return newCharacter;
          });
        }}
      />
    </Modal.Content>
  );
}
