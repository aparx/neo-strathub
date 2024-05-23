"use client";
import { UserField } from "@/modules/auth/components";
import {
  MemberSlotData,
  TeamMemberData,
  useGetMembersForSlot,
  useGetMemberSlots,
} from "@/modules/team/modals/members/hooks";
import { vars } from "@repo/theme";
import { DragScrollArea, Modal, Text } from "@repo/ui/components";
import { blendColors } from "@repo/ui/utils";
import * as css from "./assignSlotModal.css";

export function AssignSlotModal({
  member,
  onSelect,
  isLoading,
}: {
  member: TeamMemberData;
  onSelect: (slot: MemberSlotData | null) => any;
  isLoading?: boolean;
}) {
  const { data } = useGetMemberSlots(member.team_id);

  return (
    <Modal.Content style={{ maxWidth: 450 }}>
      <Modal.Title>
        Assign slot to {member.profile.name}
        <Modal.Exit />
      </Modal.Title>
      <ol className={css.slotList}>
        <li>
          <NoSlotRow onSelect={() => onSelect(null)} />
        </li>
        {data?.data?.map((slot) => (
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
  slot: MemberSlotData;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const { id, color, index } = slot;
  const { data } = useGetMembersForSlot(id);

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
        #{1 + (index ?? 0)}
      </Text>
      <DragScrollArea asChild>
        {data?.data?.length === 0 ? (
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
            {data?.data?.map((x) => (
              <li className={css.player} key={x.member_id}>
                <UserField profile={x.team_member.profile} />
              </li>
            ))}
          </ul>
        )}
      </DragScrollArea>
    </button>
  );
}
