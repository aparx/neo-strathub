"use client";
import { DeleteBookModal, RenameBookModal } from "@/modules/book/modals";
import { Icon, Modal, Popover } from "@repo/ui/components";
import { useState } from "react";

interface BookData {
  id: string;
  name: string;
}

interface BookPopoverBaseProps {
  id: string;
  name: string;
  update: (id: string, mapper: (data: BookData) => BookData | null) => void;
}

export type BookPopoverProps = BookPopoverBaseProps &
  Popover.PopoverContentProps;

export function BookPopover({
  id,
  name,
  update,
  ...restProps
}: BookPopoverProps) {
  return (
    <Popover.Content {...restProps}>
      <RenameButton id={id} name={name} update={update} />
      <Popover.Divider />
      <DeleteButton id={id} name={name} update={update} />
    </Popover.Content>
  );
}

function RenameButton({ id, name, update }: BookPopoverBaseProps) {
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <PopoverItem.Button>
          <Icon.Mapped type={"rename"} size={"sm"} />
          Rename
        </PopoverItem.Button>
      </Modal.Trigger>
      {open && (
        <RenameBookModal
          id={id}
          name={name}
          onRename={(name) => {
            setOpen(false);
            update(id, (current) => ({ ...current, name }));
          }}
        />
      )}
    </Modal.Root>
  );
}

function DeleteButton({ id, name, update }: BookPopoverBaseProps) {
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <PopoverItem.Button color={"destructive"}>
          <Icon.Mapped type={"delete"} size={"sm"} />
          Delete
        </PopoverItem.Button>
      </Modal.Trigger>
      {open && (
        <DeleteBookModal
          id={id}
          name={name}
          onDelete={() => {
            setOpen(false);
            update(id, () => null);
          }}
        />
      )}
    </Modal.Root>
  );
}
