"use client";
import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { OpenModalLink } from "@/modules/modal/components";
import { createClient } from "@/utils/supabase/client";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useItemContext } from "../context";

export function SelectorHeader() {
  const { filter, loading } = useItemContext();
  const params = useParams<{ teamId?: string }>();
  const { user } = useUserContext();

  const [addable, setAddable] = useState(false);

  useEffect(() => {
    if (!user) return setAddable(false);
    if (!params.teamId) return setAddable(true);

    const isAuthorized = (flags: number) =>
      hasFlag(flags, TeamMemberFlags.MODIFY_BOOKS);

    createClient()
      .from("team_member")
      .select("team_member_role!inner(flags)")
      .eq("team_id", params.teamId)
      .eq("profile_id", user.id)
      .single()
      .then(({ data }) => {
        // Only allow to be able to add new books if authorized to do so
        setAddable(data != null && isAuthorized(data.team_member_role.flags));
      });
  }, [params.teamId, user?.id]);

  return (
    <Flexbox gap={"sm"} style={{ width: "100%" }}>
      <TextField
        leading={<Icon.Mapped type={"search"} color={"red"} />}
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
        style={{ flexGrow: 1, width: "100%" }}
        disabled={loading}
      />
      <Button asChild appearance={"icon"} disabled={!addable}>
        <OpenModalLink modal={params.teamId ? "createBook" : "createTeam"}>
          <Icon.Mapped type={"add"} />
        </OpenModalLink>
      </Button>
    </Flexbox>
  );
}
