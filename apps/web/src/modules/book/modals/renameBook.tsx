import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flexbox, Icon, Modal, TextField } from "@repo/ui/components";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .regex(/^(?!\s*$).+/, "Name must not be empty")
    .min(2)
    .max(32),
});

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
  const { register, handleSubmit, formState, setError } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

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
        setError("name", { message: error.message });
      }
    });
  }

  return (
    <Modal.Content>
      <Modal.Title>
        Rename Book {name}
        <Modal.Exit />
      </Modal.Title>
      <Flexbox asChild orient={"vertical"} style={{ gap: "inherit" }}>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            {...register("name")}
            placeholder={"Enter a new name"}
            disabled={isPending}
            error={formState.errors.name?.message}
          />
          <Button type={"submit"} style={{ marginLeft: "auto" }}>
            Save
            <Icon.Mapped type={"next"} />
          </Button>
        </form>
      </Flexbox>
    </Modal.Content>
  );
}
