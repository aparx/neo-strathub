import {
  Button,
  Flexbox,
  Icon,
  IconButton,
  IconButtonProps,
  Modal,
} from "@repo/ui/components";
import { ExtractIterable } from "@repo/utils";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdPersonRemove } from "react-icons/md";

import { mergeClassNames } from "@repo/utils";
import * as css from "./removeMemberButton.css";

type RemoveMemberButtonBaseProps = Omit<IconButtonProps, "children">;

export interface RemoveMemberButtonProps extends RemoveMemberButtonBaseProps {
  /** Field displayed in characterModal showing the user and their name */
  children?: ExtractIterable<React.ReactNode>;
  /** Callback called whenever the removal is confirmed (e.g. through a characterModal) */
  onConfirm: () => any;
}

export function RemoveMemberButton({
  onConfirm,
  children,
  className,
  ...restProps
}: RemoveMemberButtonProps) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <IconButton
          aria-label={"Remove actions"}
          className={mergeClassNames(className, css.trigger)}
          {...restProps}
        >
          <Icon.Custom>
            <IoMdRemoveCircle />
          </Icon.Custom>
        </IconButton>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title>About to kick a member</Modal.Title>
        <Flexbox orient={"vertical"} gap={"md"}>
          <Flexbox gap={"md"} align={"center"}>
            You are about to kick
            {children}
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
