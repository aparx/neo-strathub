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
import { RxValueNone } from "react-icons/rx";
import { useEditorContext } from "../../../../_context";
import { createForegroundSlotColor } from "../../../characters/components";
import * as css from "./memberList.css";

export function SidepanelMemberList() {
  const [{ blueprint }] = useEditorContext();
  const [{ members }] = useTeamContext();
  const [{ data: slots }] = useSlotContext();
  const user = useUserContext();

  const sortedArray = useMemo(
    () =>
      [...members].sort(({ presence: a }, { presence: b }) => {
        if (a.profileId === user.user?.id && b.profileId !== a.profileId)
          return -1;
        if (a.documentId !== b.documentId)
          return a.documentId === blueprint.id ? -1 : 1;
        if (a.status === b.status) return 0;
        return a.status === "online" ? -1 : 1;
      }),
    [members],
  );

  return (
    <ul className={css.list}>
      {sortedArray.map((member) => {
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

  const slotColor = slot?.color || vars.colors.emphasis.medium;

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
        border: "1px solid transparent",
        borderColor: self ? slotColor : vars.colors.outline.card,
        borderRadius: vars.roundness.sm,
      }}
    >
      <UserField profile={profile} presence={fieldPresence} />
      <Text
        type="label"
        size="lg"
        data={{ weight: 800, font: "mono" }}
        className={css.slot}
        style={{
          background: slotColor,
          color: createForegroundSlotColor(slotColor),
        }}
      >
        {1 + (slot?.index ?? -1) || <RxValueNone />}
      </Text>
    </Text>
  );
}
