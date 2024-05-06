"use client";
import { createTeam } from "@/modules/team/actions/createTeam";
import { PlanSelect } from "@/modules/team/modals/create/components";
import {
  Button,
  Flexbox,
  Icon,
  Modal,
  Spinner,
  TextField,
} from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export function CreateTeamModal() {
  const [state, dispatch] = useFormState(createTeam, null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state?.state !== "success") return;
    setLoading(true); // ensure loading state is kept while redirecting
    router.replace(`/dashboard/${state.createdId}`);
  }, [state]);

  return (
    <Modal.Content asChild>
      <form action={dispatch}>
        <Modal.Title>
          <Flexbox gap={"md"} align={"center"}>
            <Icon.Mapped type={"members"} />
            Create a new team
          </Flexbox>
          <Modal.Exit />
        </Modal.Title>
        <FormContent loading={loading} state={state} />
      </form>
    </Modal.Content>
  );
}

function FormContent({
  loading,
  state,
}: {
  loading: boolean;
  state: InferAsync<ReturnType<typeof createTeam>> | null;
}) {
  const isLoading = useFormStatus().pending || loading;

  return (
    <>
      <TextField
        name={"name"}
        placeholder={"Unique team name"}
        disabled={isLoading}
        error={
          state?.state === "error"
            ? `Error: ${state?.error?.name?.join(" ")}`
            : null
        }
      />
      <PlanSelect />
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
