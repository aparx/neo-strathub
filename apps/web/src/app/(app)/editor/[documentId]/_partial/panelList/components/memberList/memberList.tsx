"use client";
import { UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import { TeamMember, useTeamContext } from "@/modules/team/context";
import {
  SlotContextSlot,
  useSlotContext,
} from "@/modules/team/modals/members/context";
import { vars } from "@repo/theme";
import { Text } from "@repo/ui/components";
import { blendAlpha } from "@repo/ui/utils";
import { Nullish } from "@repo/utils";
import { useMemo } from "react";
import { useEditorContext } from "../../../../_context";
import * as css from "./memberList.css";

export function SidepanelMemberList() {
  const [{ blueprint }] = useEditorContext();
  const [{ members }] = useTeamContext();
  const [{ data: slots, isFetching }] = useSlotContext();

  const memberData = useMemo(() => {
    return members.sort(({ presence: a }) => {
      return a.documentId === blueprint.id && a.status === "online" ? -1 : 1;
    });
  }, [members]);

  return (
    <ul className={css.list}>
      {memberData.map((member) => {
        const slot = slots?.find((slot) =>
          slot.members.find((x) => x.id === member.id),
        );
        return (
          <li key={member.id}>
            <MemberItem {...member} slot={slot} />
          </li>
        );
      })}
    </ul>
  );
}

function MemberItem({
  profile,
  presence,
  slot,
}: TeamMember & {
  slot: SlotContextSlot | Nullish;
}) {
  const [{ blueprint }] = useEditorContext();
  const { user } = useUserContext();
  const self = profile.id === user?.id;
  const isInDocument =
    presence.status === "online" && presence.documentId === blueprint.id;
  const fieldPresence = isInDocument ? "present" : presence.status || "offline";

  const slotColor = slot?.color || "grey";

  return (
    <Text
      type="label"
      size="lg"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: vars.spacing.md,
        marginLeft: vars.spacing.md,
        marginRight: vars.spacing.md,
        background: self ? blendAlpha(slotColor, 0.2) : vars.colors.accents[3],
        border: self
          ? `1px solid ${slotColor}`
          : `1px solid ${vars.colors.outline.card}`,
        borderRadius: vars.roundness.sm,
      }}
    >
      <UserField profile={profile} presence={fieldPresence} />
      <Text
        type="label"
        size="lg"
        data={{ weight: 600 }}
        className={css.slot}
        style={{ background: slotColor }}
      >
        {1 + (slot?.index ?? -1) || "/"}
      </Text>
    </Text>
  );
}
