"use client";
import { UserField } from "@/modules/auth/components";
import { TeamMemberData } from "@/modules/team/hooks";
import {
  SlotContextSlot,
  useSlotContext,
} from "@/modules/team/modals/members/context/slotContext";
import { vars } from "@repo/theme";
import { DragScrollArea, Modal, Text } from "@repo/ui/components";
import { blendColors } from "@repo/ui/utils";
import * as css from "./selectSlotModal.css";

export function SelectSlotModal({
  member,
  onSelect,
  isLoading,
}: {
  member: TeamMemberData;
  onSelect: (slot: SlotContextSlot | null) => any;
  isLoading?: boolean;
}) {
  const [{ data }] = useSlotContext();

  return (
    <Modal.Content style={{ maxWidth: 450 }}>
      <Modal.Title>
        <span>
          Assign{" "}
          <span style={{ color: vars.colors.emphasis.medium }}>
            {member.profile.name}
          </span>{" "}
          to slot
        </span>
        <Modal.Exit />
      </Modal.Title>
      <ol className={css.slotList}>
        <li>
          <NoSlotRow onSelect={() => onSelect(null)} />
        </li>
        {data?.map((slot) => (
          <li key={slot.id}>
            <SlotRow
              slot={slot}
              onSelect={() => onSelect(slot)}
              disabled={isLoading}
            />
          </li>
        ))}
      </ol>
    </Modal.Content>
  );
}

function NoSlotRow({
  onSelect,
  disabled,
}: {
  onSelect: () => void;
  disabled?: boolean;
}) {
  const background = vars.colors.accents[4];
  const color = vars.colors.emphasis.medium;

  return (
    <button
      className={css.slot({ disabled: disabled })}
      style={{ background, color }}
      onClick={onSelect}
      disabled={disabled}
      data-disabled={disabled}
    >
      <Text
        className={css.index({ mode: "empty" })}
        style={{ color: background, background: color }}
      />
      <Text>No Slot</Text>
    </button>
  );
}

function SlotRow({
  slot,
  onSelect,
  disabled,
}: {
  slot: SlotContextSlot;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const { id, color, index, members } = slot;

  const background = blendColors(color, "black 80%");

  return (
    <button
      className={css.slot({ disabled: disabled })}
      style={{ background, color }}
      onClick={onSelect}
      disabled={disabled}
      data-disabled={disabled}
    >
      <Text
        data={{ weight: 800 }}
        className={css.index({ mode: "number" })}
        style={{ color: background, background: color }}
      >
        {1 + (index ?? 0)}
      </Text>
      <DragScrollArea asChild>
        {members?.length === 0 ? (
          <Text
            style={{
              color: vars.colors.emphasis.medium,
            }}
          >
            Empty slot
          </Text>
        ) : (
          <ul
            className={css.playerList}
            aria-label={"Users assigned to this slot"}
          >
            {members?.map((x) => (
              <li className={css.player} key={x.id}>
                <UserField profile={x.profile} />
              </li>
            ))}
          </ul>
        )}
      </DragScrollArea>
    </button>
  );
}
