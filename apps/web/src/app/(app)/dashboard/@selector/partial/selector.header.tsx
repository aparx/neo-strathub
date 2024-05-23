"use client";
import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { OpenModalLink } from "@/modules/modal/components";
import { createClient } from "@/utils/supabase/client";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useItemContext } from "../context";

export function SelectorHeader() {
  const { filter, loading } = useItemContext();
  const params = useParams<{ teamId?: string }>();
  const { user } = useUserContext();

  const [addable, setAddable] = useState(false);

  const { data: selfMember } = useQuery({
    queryKey: ["teamMember", params.teamId, user?.id],
    queryFn: async () =>
      await createClient()
        .from("team_member")
        .select("member_role!inner(flags)")
        .eq("team_id", params.teamId!)
        .eq("profile_id", user!.id)
        .single(),
    enabled: Boolean(params.teamId && user?.id),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!selfMember?.data) return setAddable(params.teamId == null);
    // Only allow to be able to add new books if authorized to do so
    const permissionFlags = selfMember.data.member_role.flags;
    setAddable(hasFlag(permissionFlags, TeamMemberFlags.MODIFY_BOOKS));
  }, [selfMember]);

  return (
    <Flexbox gap={"sm"} style={{ width: "100%" }}>
      <search style={{ flexGrow: 1, width: "100%" }}>
        <TextField
          leading={<Icon.Mapped type={"search"} color={"red"} />}
          placeholder={"Search"}
          onInput={(e) => filter.update(e.currentTarget.value)}
          disabled={loading}
        />
      </search>
      {addable && (
        <Button asChild appearance={"icon"}>
          <OpenModalLink modal={params.teamId ? "createBook" : "createTeam"}>
            <Icon.Mapped type={"add"} />
          </OpenModalLink>
        </Button>
      )}
    </Flexbox>
  );
}
