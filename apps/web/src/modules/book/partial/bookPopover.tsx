"use client";
import { deleteBook } from "@/modules/book/actions/deleteBook";
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
        <Modal.Content>
          <Modal.Title>
            Delete {bookName}?
            <Modal.Exit />
          </Modal.Title>
          You are about to delete the book {bookName}.
          <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
            <Modal.Close asChild disabled={isPending}>
              <Button>Cancel</Button>
            </Modal.Close>
            <Button
              color={"destructive"}
              onClick={confirmDelete}
              disabled={isPending}
            >
              <Icon.Mapped type={"delete"} />
              Delete
            </Button>
          </Flexbox>
        </Modal.Content>
      </Modal.Root>
    </Popover.Content>
  );
}
