"use client";
import { AvatarPresence, UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import {
  TeamMemberData,
  useGetMembers,
} from "@/modules/team/modals/members/hooks";
import { createClient } from "@/utils/supabase/client";
import { Text } from "@repo/ui/components";
import { nonNull } from "@repo/utils";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useEditor } from "../../../../_context";
import * as css from "./memberList.css";

export function SidepanelMemberList() {
  const [{ blueprint }] = useEditor();
  const { data } = useGetMembers(blueprint.book.team.id);

  const [onlineSet, setOnlineSet] = useState(new Set<string>());
  usePresence(`presence_${blueprint.id}`, setOnlineSet);

  const memberData = useMemo(() => {
    if (!data?.data) return [];
    return data?.data
      .map((member) => {
        const isOnline = onlineSet.has(member.profile_id);
        const presence: AvatarPresence = isOnline ? "online" : "offline";
        return { ...member, presence };
      })
      .sort(({ presence: a }, { presence: b }) => {
        return a === b ? 0 : a === "online" ? -1 : 1;
      });
  }, [data?.data, onlineSet]);

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

function MemberItem({
  profile,
  presence,
}: TeamMemberData & {
  presence: AvatarPresence;
}) {
  const { user } = useUserContext();
  const self = profile.id === user?.id;
  return (
    <Text type="label" size="lg" className={css.item({ self })}>
      <UserField profile={profile} presence={presence} />
      <div className={css.color} style={{ background: "green" }} />
    </Text>
  );
}

function usePresence(
  roomName: string,
  updateSet: Dispatch<SetStateAction<Set<string>>>,
) {
  // TODO move this to an external source and/or utility/hook
  const { user } = useUserContext();

  useEffect(() => {
    const supabase = createClient();
    const room = supabase.channel(roomName);
    room
      .on("presence", { event: "sync" }, () => {
        const newSet = new Set<string>();
        Object.values(room.presenceState())
          .flatMap((x) => x)
          .map((x: any) => x.profileId)
          .filter(nonNull)
          .forEach((x) => newSet.add(x));
        updateSet(newSet);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !user?.id) return;
        await room.track({ profileId: user.id });
      });
    return () => {
      supabase.removeChannel(room);
    };
  }, []);
}
