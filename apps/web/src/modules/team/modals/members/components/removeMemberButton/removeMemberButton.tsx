import { TeamMemberData } from "@/modules/team/modals/members/hooks/index.ts";
import { KickMemberModal } from "@/modules/team/modals/members/modals/index.ts";
import { Icon, IconButton, IconButtonProps, Modal } from "@repo/ui/components";
import { RxExit } from "react-icons/rx";

type RemoveMemberButtonBaseProps = Omit<IconButtonProps, "children">;

export interface RemoveMemberButtonProps extends RemoveMemberButtonBaseProps {
  member: TeamMemberData;
  onKick: () => any;
}

export function RemoveMemberButton({
  onKick,
  children,
  member,
  className,
  ...restProps
}: RemoveMemberButtonProps) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <IconButton
          aria-label={"Remove actions"}
          className={className}
          {...restProps}
        >
          <Icon.Custom>
            <RxExit />
          </Icon.Custom>
        </IconButton>
      </Modal.Trigger>
      <KickMemberModal {...member} onKick={onKick} />
    </Modal.Root>
  );
}
