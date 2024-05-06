"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { createBook } from "@/modules/book/actions/createBook";
import { GameSelect } from "@/modules/book/modals/create/components";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { useURL } from "@/utils/hooks";
import { createClient } from "@/utils/supabase/client";
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
    if (!team.data) return;
    createClient()
      .rpc("create_book", {
        book_name: "testBook",
        target_team_id: team.data.id,
        target_game_id: 33,
      })
      .then(console.log);
  }, [team.data]);

  useEffect(() => {
    if (state?.state !== "success") return;
    setLoading(true); // ensure loading state is kept while rerouting
    const newURL = new URL(url);
    newURL.searchParams.delete(DASHBOARD_QUERY_PARAMS.modal);
    newURL.searchParams.set(DASHBOARD_QUERY_PARAMS.book, state.createdId);
    router.replace(newURL.href);
  }, [state]);

  return (
    <Modal.Content asChild style={{ maxWidth: 300 }}>
      <form
        action={(formData) => {
          formData.set("teamId", team.data!.id);
          dispatch(formData);
        }}
      >
        <Modal.Title>
          <Breadcrumbs crumbs={[team.data?.name, <BreadcrumbTitle />]} />
          <Modal.Exit />
        </Modal.Title>
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
      <GameSelect name={"gameId"} />
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
