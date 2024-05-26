"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { ModalParameter } from "@/modules/modal/components";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { useURL } from "@/utils/hooks";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Modal,
  Spinner,
  TextField,
} from "@repo/ui/components";
import { useRouter } from "next/navigation";
import { PostgresError } from "pg-error-enum";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createBookSchema = z.object({
  name: z.string().min(3).max(32),
});
type FormSchema = z.infer<typeof createBookSchema>;

export function CreateBookModal() {
  const team = useGetTeamFromParams();
  const url = useURL();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState, setError } = useForm<FormSchema>({
    resolver: zodResolver(createBookSchema),
  });

  function submit({ name }: FormSchema) {
    startTransition(async () => {
      const { data, error } = await createClient().rpc("create_book", {
        team_id: team.data!.id,
        book_name: name,
      });

      if (error?.code === PostgresError.UNIQUE_VIOLATION) {
        setError("name", { message: "Book with this name already exists" });
      } else if (error) {
        setError("name", { message: error.message });
      } else if (data) {
        // Redirect user to the just created book, since success
        const newURL = new URL(url);
        ModalParameter.deleteAll(newURL.searchParams);
        newURL.searchParams.set(DASHBOARD_QUERY_PARAMS.book, data);
        await router.replace(newURL.href);
      }
    });
  }

  const isLoading = formState.isLoading || isPending;

  return (
    <Modal.Content style={{ maxWidth: 300 }}>
      <Flexbox asChild orient={"vertical"} gap={"lg"}>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Title>
            <Breadcrumbs>
              {team.data?.name}
              <Flexbox gap={"md"}>
                <Icon.Mapped type={"book"} />
                New Stratbook
              </Flexbox>
            </Breadcrumbs>
            <Modal.Exit />
          </Modal.Title>
          <TextField
            {...register("name")}
            placeholder={"Name of book"}
            disabled={isLoading}
            error={formState.errors.name?.message}
          />
          <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
            <Modal.Close asChild>
              <Button>Cancel</Button>
            </Modal.Close>
            <Button
              type={"submit"}
              color={"cta"}
              disabled={isLoading || !formState.isValid}
            >
              Create
              {isLoading ? (
                <Spinner color={"inherit"} />
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
