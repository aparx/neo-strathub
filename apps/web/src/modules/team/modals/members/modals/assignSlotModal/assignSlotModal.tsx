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

export function AssignSlotModal({ member }: { member: TeamMemberData }) {
  const { data } = useGetMemberSlots(member.team_id);

  // TODO fetch slots
  return (
    <Modal.Content style={{ maxWidth: 450 }}>
      <Modal.Title>Assign slot to {member.profile.username}</Modal.Title>
      <ol className={css.slotList}>
        {data?.data?.map((slot) => (
          <li key={slot.id}>
            <SlotRow {...slot} />
          </li>
        ))}
      </ol>
    </Modal.Content>
  );
}

function SlotRow({ id, slot_index, color }: MemberSlotData) {
  const { data } = useGetMembersForSlot(id);

  const background = blendColors(color, "black 80%");

  return (
    <article className={css.slot} style={{ background, color }}>
      <Text
        data={{ weight: 800 }}
        className={css.index}
        style={{ color: background, background: color }}
      >
        #{1 + (slot_index ?? 0)}
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
            aria-label={"users assigned to this slot"}
          >
            {data?.data?.map((x) => (
              <li className={css.player} key={x.member_id}>
                <UserField profile={x.team_member.profile} />
              </li>
            ))}
          </ul>
        )}
      </DragScrollArea>
    </article>
  );
}
