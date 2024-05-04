"use client";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Modal,
  Spinner,
  TextField,
} from "@repo/ui/components";
import { useFormStatus } from "react-dom";

function BreadcrumbTitle() {
  return (
    <Flexbox gap={"md"}>
      <Icon.Mapped type={"book"} />
      New Stratbook
    </Flexbox>
  );
}

export function CreateBookModal() {
  const team = useGetTeamFromParams();

  return (
    <Modal.Content asChild>
      <form>
        <Modal.Title>
          <Breadcrumbs
            breadcrumbs={[
              { display: team.data?.name },
              { display: <BreadcrumbTitle /> },
            ]}
          />
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
        <FormContent />
      </form>
    </Modal.Content>
  );
}

function FormContent() {
  const isLoading = useFormStatus().pending;

  return (
    <>
      <TextField
        name={"name"}
        placeholder={"Name of book"}
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
