"use client";
import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { CharacterGadgetSlotData } from "@/modules/blueprint/characters/actions";
import { GameObjectData } from "@/modules/gameObject/hooks";
import { Modal } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";
import { ObjectGrid } from "../objectGrid";

export function GadgetModal({
  gadget,
  onSave,
}: {
  gadget: SharedState<CharacterGadgetSlotData>;
  onSave: (object: GameObjectData | null) => Promise<any>;
}) {
  const { blueprint, channel } = useEditorContext();

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        Assign a gadget or ability
        <Modal.Exit />
      </Modal.Title>
      <ObjectGrid
        filters={{ type: "gadget", gameId: blueprint.arena.game_id }}
        activeObjectId={gadget.state.game_object?.id}
        setActiveObject={async (newObject) => {
          const beforeGadget = gadget.state;
          const newGadget = { ...gadget.state, game_object: newObject };
          gadget.update(newGadget);
          onSave(newObject)
            .then(() => channel.broadcast("updateGadget", newGadget))
            .catch(() => gadget.update(beforeGadget) /* TODO sync */);
        }}
      />
    </Modal.Content>
  );
}
