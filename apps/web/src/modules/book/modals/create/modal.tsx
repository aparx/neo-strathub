"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { createBook } from "@/modules/book/actions/createBook";
import { createBookSchema } from "@/modules/book/actions/createBook.schema";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { useURL } from "@/utils/hooks";
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
import { InferAsync } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = createBookSchema.pick({ name: true });
type FormSchema = z.infer<typeof formSchema>;

export function CreateBookModal() {
  const team = useGetTeamFromParams();
  const url = useURL();
  const router = useRouter();
  const [state, setState] =
    useState<InferAsync<ReturnType<typeof createBook>>>();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  function submit({ name }: FormSchema) {
    startTransition(async () => {
      const newState = await createBook({ teamId: team.data!.id, name });
      if (newState.state !== "success") return setState(newState);

      // Redirect user to the just created book, since success
      const newURL = new URL(url);
      const newId = newState.createdId;
      newURL.searchParams.delete(DASHBOARD_QUERY_PARAMS.modal);
      newURL.searchParams.set(DASHBOARD_QUERY_PARAMS.book, newId);
      await router.replace(newURL.href);
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
            error={
              formState.errors.name?.message ||
              (state?.state === "error" && state?.error.name) ||
              null
            }
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
