import { UserField } from "@/modules/auth/components/index.ts";
import { TeamMemberData } from "@/modules/team/modals/members/hooks/index.ts";
import { vars } from "@repo/theme";
import { Button, Flexbox, Modal } from "@repo/ui/components";
import { RxExit } from "react-icons/rx";

export function KickMemberModal({
  profile,
  onKick,
}: TeamMemberData & {
  onKick?: () => any;
}) {
  return (
    <Modal.Content>
      <Modal.Title>About to kick a member</Modal.Title>
      <Flexbox orient={"vertical"} gap={"md"}>
        <Flexbox gap={"md"} align={"center"}>
          You are about to kick
          <UserField
            profile={profile}
            style={{ color: vars.colors.emphasis.high }}
          />
          from the team.
        </Flexbox>
        A kicked member can always rejoin if you invite them to.
      </Flexbox>
      <Flexbox asChild gap={"md"} style={{ marginLeft: "auto" }}>
        <footer>
          <Modal.Close asChild>
            <Button>Cancel</Button>
          </Modal.Close>
          <Button onClick={onKick} color={"destructive"}>
            Kick <RxExit />
          </Button>
        </footer>
      </Flexbox>
    </Modal.Content>
  );
}
