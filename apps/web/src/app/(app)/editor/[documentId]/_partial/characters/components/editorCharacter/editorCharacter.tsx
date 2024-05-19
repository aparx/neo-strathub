"use client";
import { CharacterModal } from "@/app/(app)/editor/[documentId]/_partial/characters/components";
import {
  BlueprintCharacterData,
  CharacterGadgetSlotData,
} from "@/modules/blueprint/characters/actions";
import { Icon, Modal } from "@repo/ui/components";
import { useSharedState } from "@repo/utils/hooks";
import { RxQuestionMarkCircled } from "react-icons/rx";
import * as css from "./editorCharacter.css";

export interface EditorCharacterProps {
  data: BlueprintCharacterData;
  slots: CharacterGadgetSlotData[];
}

interface GadgetSlotProps {
  data: CharacterGadgetSlotData;
  color: string;
}

export function EditorCharacter({ data, slots }: EditorCharacterProps) {
  const sharedState = useSharedState(data);
  const active = data.game_object?.url != null;
  const color = data.team_player_slot?.color ?? "transparent";

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <li style={{ listStyle: "none" }}>
          <button
            data-character-id={sharedState.state.id}
            className={css.characterButton}
            aria-label={"Gadgets used"}
          >
            <div
              className={css.characterBox({ active })}
              style={{ boxShadow: `inset 0 0 0 2px ${color}` }}
            >
              <RxQuestionMarkCircled size={"1em"} />
            </div>
            <ol className={css.gadgetList}>
              {slots.map((gadget) => (
                <GadgetSlot key={gadget.id} data={gadget} color={color} />
              ))}
            </ol>
          </button>
        </li>
      </Modal.Trigger>
      <CharacterModal character={sharedState} />
    </Modal.Root>
  );
}

function GadgetSlot({ data, color }: GadgetSlotProps) {
  return (
    <li
      key={data.id}
      data-gadget-id={data.id}
      className={css.gadgetBox({ active: false })}
    >
      <Icon.Mapped type={"add"} />
    </li>
  );
}
