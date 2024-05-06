"use client";
import { deleteBook } from "@/modules/book/actions/deleteBook";
import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Modal, Popover } from "@repo/ui/components";
import { useState, useTransition } from "react";

export interface BookPopoverProps extends Popover.PopoverContentProps {
  bookId: string;
  bookName: string;
}

export function BookPopover({
  bookId,
  bookName,
  ...restProps
}: BookPopoverProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteBook(bookId);
      console.log(result);

      // TODO show toast + error handling
      if (result.state === "success") setOpen(false);
    });
  }

  return (
    <Popover.Content {...restProps}>
      <Popover.Item>
        <Icon.Mapped type={"rename"} size={"sm"} />
        Rename
      </Popover.Item>
      <Popover.Divider />
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger asChild>
          <Popover.Item color={"destructive"}>
            <Icon.Mapped type={"delete"} size={"sm"} />
            Delete
          </Popover.Item>
        </Modal.Trigger>
        <ConfirmDeletionModalContent
          isPending={isPending}
          bookName={bookName}
          bookId={bookId}
          onDelete={confirmDelete}
        />
      </Modal.Root>
    </Popover.Content>
  );
}

function ConfirmDeletionModalContent({
  isPending,
  bookName,
  bookId,
  onDelete,
}: {
  isPending: boolean;
  bookName: string;
  bookId: string;
  onDelete: () => any;
}) {
  return (
    <Modal.Content>
      <Modal.Title>
        Deleting {bookName}
        <Modal.Exit />
      </Modal.Title>
      <Flexbox orient={"vertical"} gap={"sm"}>
        <Flexbox gap={"md"}>
          You are about to delete
          <Flexbox asChild gap={"sm"}>
            <span style={{ color: vars.colors.emphasis.high }}>
              <Icon.Mapped type={"book"} /> {bookName}
            </span>
          </Flexbox>
          and all its blueprints!
        </Flexbox>
        <p style={{ color: vars.colors.destructive.lighter }}>
          This action is unrecoverable and permanent.
        </p>
      </Flexbox>
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild disabled={isPending}>
          <Button>Cancel</Button>
        </Modal.Close>
        <Button color={"destructive"} onClick={onDelete} disabled={isPending}>
          <Icon.Mapped type={"delete"} />
          Delete Forever
        </Button>
      </Flexbox>
    </Modal.Content>
  );
}
