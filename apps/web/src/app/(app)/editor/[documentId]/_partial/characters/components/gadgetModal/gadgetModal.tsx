"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import type { CharacterGadgetSlotData } from "@/modules/blueprint/actions";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { Modal } from "@repo/ui/components";
import { ObjectGrid } from "../objectGrid";

export function GadgetModal({
  gadget,
  onUpdate,
}: {
  gadget: CharacterGadgetSlotData;
  onUpdate: (
    newObject: GameObjectData | null,
    oldObject: GameObjectData | null,
  ) => any;
}) {
  const [{ blueprint, channel }] = useEditorContext();

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        Assign a gadget or ability
        <Modal.Exit />
      </Modal.Title>
      <ObjectGrid
        gameId={blueprint.arena.game_id}
        type="gadget"
        activeObjectId={gadget.game_object?.id}
        setActiveObject={(newObject) => {
          onUpdate(newObject, gadget.game_object);
        }}
      />
    </Modal.Content>
  );
}
