import { deleteBook } from "@/modules/book/actions/deleteBook";
import { vars } from "@repo/theme";
import {
  Button,
  Callout,
  Flexbox,
  Icon,
  Modal,
  Spinner,
} from "@repo/ui/components";
import { useTransition } from "react";

export function DeleteBookModal({
  id,
  name,
  onDelete,
}: {
  id: string;
  name: string;
  /** Triggered, when the deletion of the book is successful */
  onDelete?: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function doDelete() {
    startTransition(async () => {
      const result = await deleteBook(id);
      // TODO show toast + error handling
      if (result.state === "success") onDelete?.();
    });
  }

  return (
    <Modal.Content>
      <Modal.Title>
        Delete {name}?
        <Modal.Exit />
      </Modal.Title>
      <Flexbox gap={"md"}>
        You are about to delete
        <Flexbox asChild gap={"sm"}>
          <span style={{ color: vars.colors.emphasis.high }}>
            <Icon.Mapped type={"book"} /> {name}
          </span>
        </Flexbox>
        and all its blueprints!
      </Flexbox>
      <Callout.Destructive>
        <p>
          This action is <strong>unrecoverable</strong> and thus{" "}
          <strong>permanent</strong>.
        </p>
      </Callout.Destructive>
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild disabled={isPending}>
          <Button>Cancel</Button>
        </Modal.Close>
        <Button color={"destructive"} onClick={doDelete} disabled={isPending}>
          Delete Forever
          {isPending ? <Spinner /> : <Icon.Mapped type={"next"} />}
        </Button>
      </Flexbox>
    </Modal.Content>
  );
}
