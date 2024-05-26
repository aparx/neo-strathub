import { createBookSchema } from "@/modules/book/modals/createBook";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flexbox,
  Icon,
  Modal,
  Spinner,
  TextField,
} from "@repo/ui/components";
import { PostgresError } from "pg-error-enum";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = createBookSchema.pick({ name: true });
type FormSchema = z.infer<typeof schema>;

export function RenameBookModal({
  id,
  name,
  onRename,
}: {
  id: string;
  name: string;
  /** Triggered, when the rename of the book is successful */
  onRename?: (newName: string) => any;
}) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState, setError, setFocus } =
    useForm<FormSchema>({ resolver: zodResolver(schema) });

  useEffect(() => setFocus("name"), [setFocus]);

  function submit(data: FormSchema) {
    startTransition(async () => {
      const newName = data.name;
      const { error } = await createClient().rpc("rename_book", {
        book_id: id,
        name: newName,
      });
      if (!error) onRename?.(newName);
      else {
        console.error("#_submitRename", error);
        let message = error.message;
        if (error.code === PostgresError.UNIQUE_VIOLATION)
          message = "Book with name already exists in this team";
        setError("name", { message: message });
      }
    });
  }

  return (
    <Modal.Content>
      <Modal.Title>
        Rename Book
        <Modal.Exit />
      </Modal.Title>
      <Flexbox asChild orient={"vertical"} style={{ gap: "inherit" }}>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            {...register("name")}
            placeholder={"Enter a new name"}
            defaultValue={name}
            disabled={isPending}
            error={formState.errors.name?.message}
          />
          <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
            <Modal.Close asChild>
              <Button disabled={isPending}>Cancel</Button>
            </Modal.Close>
            <Button
              type={"submit"}
              color={"cta"}
              style={{ marginLeft: "auto" }}
              disabled={isPending}
            >
              Save
              {isPending ? (
                <Spinner style={{ color: "inherit" }} />
              ) : (
                <Icon.Mapped type={"next"} />
              )}
            </Button>
          </Flexbox>
        </form>
      </Flexbox>
    </Modal.Content>
  );
}
