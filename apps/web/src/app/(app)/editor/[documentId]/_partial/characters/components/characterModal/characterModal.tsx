"use client";
import type { BlueprintCharacterData } from "@/modules/blueprint/actions";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { vars } from "@repo/theme";
import { Modal, Text } from "@repo/ui/components";
import { createForegroundSlotColor } from "../editorCharacter";
import { ObjectGrid } from "../objectGrid";
import * as css from "./characterModal.css";

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
  const backColor = character.player_slot?.color ?? vars.colors.emphasis.high;
  const foreColor = createForegroundSlotColor(backColor);

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        <span className={css.title}>
          <Text
            className={css.index}
            data={{ weight: 800, font: "mono" }}
            style={{
              background: backColor,
              color: foreColor,
            }}
          >
            {1 + character.index}
          </Text>
          Reassign character
        </span>
        <Modal.Exit />
      </Modal.Title>
      <ObjectGrid
        type="character"
        activeObjectId={character.game_object?.id}
        setActiveObject={async (newObject) => {
          onUpdate(newObject, character.game_object);
        }}
      />
    </Modal.Content>
  );
}
