import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { ObjectGrid } from "@/app/(app)/editor/[documentId]/_partial/characters/components/objectGrid";
import { CharacterGadgetSlotData } from "@/modules/blueprint/characters/actions";
import { Modal } from "@repo/ui/components";
import { SharedState } from "@repo/utils/hooks";

export function GadgetModal({
  gadget,
}: {
  gadget: SharedState<CharacterGadgetSlotData>;
}) {
  const { blueprint, channel } = useEditorContext();

  return (
    <Modal.Content minWidth={600}>
      <Modal.Title>
        Manage gadget
        <Modal.Exit />
      </Modal.Title>
      <ObjectGrid
        filters={{ type: "gadget", gameId: blueprint.arena.game_id }}
        activeObjectId={gadget.state.game_object?.id}
        setActiveObject={(newObject) =>
          gadget.update((prev) => {
            const newGadget = { ...prev, game_object: newObject };
            channel.broadcast("updateGadget", newGadget);
            return newGadget;
          })
        }
      />
    </Modal.Content>
  );
}
