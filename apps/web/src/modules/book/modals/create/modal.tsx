"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { createBook } from "@/modules/book/actions/createBook";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { useURL } from "@/utils/hooks";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Modal,
  Spinner,
  TextField,
} from "@repo/ui/components";
import { InferAsync, Nullish } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function BreadcrumbTitle() {
  return (
    <Flexbox gap={"md"}>
      <Icon.Mapped type={"book"} />
      New Stratbook
    </Flexbox>
  );
}

export function CreateBookModal() {
  // TODO ERROR HANDLING
  const [state, dispatch] = useFormState(createBook, null);
  const [loading, setLoading] = useState(false);
  const team = useGetTeamFromParams();
  const url = useURL();
  const router = useRouter();

  useEffect(() => {
    if (state?.state !== "success") return;
    setLoading(true); // ensure loading state is kept while rerouting
    const newURL = new URL(url);
    newURL.searchParams.set(DASHBOARD_QUERY_PARAMS.book, state.createdId);
    router.replace(newURL.href);
  }, [state]);

  function submit(formData: FormData) {
    formData.set("teamId", team.data!.id);
    formData.set("gameId", "1"); // TODO
    dispatch(formData);
  }

  return (
    <Modal.Content asChild>
      <form action={submit}>
        <Modal.Title>
          <Breadcrumbs crumbs={[team.data?.name, <BreadcrumbTitle />]} />
          <Modal.Exit />
        </Modal.Title>
        <input
          type={"text"}
          name={"teamId"}
          value={team.data?.id}
          disabled
          aria-hidden
          style={{ display: "none" }}
        />
        <FormContent loading={loading || !team.data} state={state} />
      </form>
    </Modal.Content>
  );
}

function FormContent({
  loading,
  state,
}: {
  loading: boolean;
  state: Nullish | InferAsync<ReturnType<typeof createBook>>;
}) {
  const isLoading = useFormStatus().pending || loading;

  return (
    <>
      <TextField
        name={"name"}
        placeholder={"Name of book"}
        error={state?.state === "error" ? state?.error.name : null}
        disabled={isLoading}
        required
      />
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild>
          <Button>Cancel</Button>
        </Modal.Close>
        <Button type={"submit"} color={"cta"} disabled={isLoading}>
          Create
          {isLoading ? (
            <Spinner color={"inherit"} />
          ) : (
            <Icon.Mapped type={"next"} />
          )}
        </Button>
      </Flexbox>
    </>
  );
}
