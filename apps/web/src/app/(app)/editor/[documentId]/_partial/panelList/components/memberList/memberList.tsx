"use client";
import { UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import { TeamMember, useTeamContext } from "@/modules/team/context";
import { Text } from "@repo/ui/components";
import { useMemo } from "react";
import { useEditorContext } from "../../../../_context";
import * as css from "./memberList.css";

export function SidepanelMemberList() {
  const [{ blueprint }] = useEditorContext();
  const [{ members }] = useTeamContext();

  const memberData = useMemo(() => {
    return members.sort(({ presence: a }) => {
      return a.documentId === blueprint.id && a.status === "online" ? -1 : 1;
    });
  }, [members]);

  return (
    <ul className={css.list}>
      {memberData.map((member) => (
        <li key={member.id}>
          <MemberItem {...member} />
        </li>
      ))}
    </ul>
  );
}

function MemberItem({ profile, presence }: TeamMember) {
  const [{ blueprint }] = useEditorContext();
  const { user } = useUserContext();
  const self = profile.id === user?.id;
  const isInDocument =
    presence.status === "online" && presence.documentId === blueprint.id;
  const fieldPresence = isInDocument ? "present" : presence.status || "offline";

  return (
    <Text type="label" size="lg" className={css.item({ self })}>
      <UserField profile={profile} presence={fieldPresence} />
      <div className={css.color} style={{ background: "green" }} />
    </Text>
  );
}
