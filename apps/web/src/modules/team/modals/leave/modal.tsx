import { useUserContext } from "@/modules/auth/context";
import {
  useGetTeamFromParams,
  UseGetTeamFromParamsResultData,
} from "@/modules/modal/hooks";
import { useGetMembers } from "@/modules/team/hooks";
import { createClient } from "@/utils/supabase/client";
import {
  Button,
  Callout,
  Flexbox,
  Icon,
  Modal,
  Spinner,
} from "@repo/ui/components";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function TeamLeaveModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return <TeamLeaveModalContent {...data} />;
}

function TeamLeaveModalContent({
  id,
  name,
}: NonNullable<UseGetTeamFromParamsResultData>) {
  const membersQuery = useGetMembers(id, true);
  const [isPending, startTransition] = useTransition();
  const { user } = useUserContext();
  const router = useRouter();
  if (membersQuery.isLoading) return <Spinner />;

  const memberCount = membersQuery.data?.data?.length;
  const willDeleteTeam = memberCount === 1;

  function onLeave() {
    if (!user) throw new Error("Unauthorized");
    startTransition(async () => {
      // 1. Get member identifier from this user
      const { data } = await createClient()
        .from("team_member")
        .select("id")
        .eq("team_id", id)
        .eq("profile_id", user!.id)
        .single();
      if (!data) throw new Error("Not a member");
      await createClient().rpc("kick_member", {
        member_id: data!.id,
      });
      window.location.replace("/"); // Enforce refresh of the entire dashboard
    });
  }

  return (
    <Modal.Content>
      <Modal.Title>
        Leave {name}?
        <Modal.Exit disabled={isPending} />
      </Modal.Title>
      Leaving the team will reset your role. You will need to be re-invited.
      {willDeleteTeam && (
        <Callout.Destructive>
          <p>
            Leaving will <strong>permanently</strong> delete this team
          </p>
        </Callout.Destructive>
      )}
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild>
          <Button color={"default"} disabled={isPending}>
            Cancel
          </Button>
        </Modal.Close>
        <Button color={"destructive"} onClick={onLeave} disabled={isPending}>
          {willDeleteTeam ? "Leave and delete" : "Leave"}
          {isPending ? <Spinner /> : <Icon.Mapped type={"leave"} />}
        </Button>
      </Flexbox>
    </Modal.Content>
  );
}
