import {
  Button,
  Flexbox,
  Icon,
  IconButton,
  IconButtonProps,
  Modal,
} from "@repo/ui/components";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdPersonRemove } from "react-icons/md";

import { mergeClassNames } from "@repo/utils";
import * as css from "./removeMemberButton.css";

type RemoveMemberButtonBaseProps = Omit<IconButtonProps, "children">;

export interface RemoveMemberButtonProps extends RemoveMemberButtonBaseProps {
  /** Field displayed in modal showing the user and their name */
  userField: React.ReactNode;
  /** Callback called whenever the removal is confirmed (e.g. through a modal) */
  onConfirm: () => any;
}

export function RemoveMemberButton({
  onConfirm,
  userField,
  className,
  ...restProps
}: RemoveMemberButtonProps) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <IconButton
          aria-label={"Remove member"}
          className={mergeClassNames(className, css.trigger)}
          {...restProps}
        >
          <Icon.Custom icon={<IoMdRemoveCircle />} />
        </IconButton>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title>About to kick a member</Modal.Title>
        <Flexbox orient={"vertical"} gap={"md"}>
          <Flexbox gap={"md"} align={"center"}>
            You are about to kick
            {userField}
            from the team.
          </Flexbox>
          A kicked member can always rejoin if you invite them to.
        </Flexbox>
        <footer className={css.footer}>
          <Modal.Close asChild>
            <Button>Cancel</Button>
          </Modal.Close>
          <Button onClick={onConfirm} color={"destructive"}>
            <MdPersonRemove /> Kick
          </Button>
        </footer>
      </Modal.Content>
    </Modal.Root>
  );
}
