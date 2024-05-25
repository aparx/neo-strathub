"use client";
import { DeleteBookModal, RenameBookModal } from "@/modules/book/modals";
import { Icon, Modal, Popover } from "@repo/ui/components";
import { useState } from "react";

interface BookData {
  id: string;
  name: string;
}

export interface BookPopoverProps extends Popover.PopoverContentProps {
  id: string;
  name: string;
  update: (id: string, mapper: (data: BookData) => BookData | null) => void;
}

export function BookPopover({
  id,
  name,
  update,
  ...restProps
}: BookPopoverProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  return (
    <Popover.Content {...restProps}>
      <Modal.Root open={renameOpen} onOpenChange={setRenameOpen}>
        <Modal.Trigger asChild>
          <Popover.Item>
            <Icon.Mapped type={"rename"} size={"sm"} />
            Rename
          </Popover.Item>
        </Modal.Trigger>
        <RenameBookModal
          id={id}
          name={name}
          onRename={(name) => {
            setRenameOpen(false);
            update(id, (current) => ({ ...current, name }));
          }}
        />
      </Modal.Root>
      <Popover.Divider />
      <Modal.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Modal.Trigger asChild>
          <Popover.Item color={"destructive"}>
            <Icon.Mapped type={"delete"} size={"sm"} />
            Delete
          </Popover.Item>
        </Modal.Trigger>
        <DeleteBookModal
          id={id}
          name={name}
          onDelete={() => {
            setDeleteOpen(false);
            update(id, () => null);
          }}
        />
      </Modal.Root>
    </Popover.Content>
  );
}
