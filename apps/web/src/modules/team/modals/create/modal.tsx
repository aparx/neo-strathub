"use client";
import { createTeam } from "@/modules/team/actions/createTeam";
import { Button, Flexbox, Icon, Modal, TextField } from "@repo/ui/components";
import { useFormState, useFormStatus } from "react-dom";

export function CreateTeamModal() {
  const [state, dispatch] = useFormState(createTeam, null);

  console.log(state);

  return (
    <Modal.Content asChild>
      <form action={dispatch}>
        <Modal.Title>
          Create a new team
          <Modal.Exit />
        </Modal.Title>
        <TextField name={"name"} placeholder={"Unique team name"} />
        <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
          <Modal.Close asChild>
            <Button>Cancel</Button>
          </Modal.Close>
          <Button color={"cta"} disabled={useFormStatus().pending}>
            Create
            <Icon.Mapped type={"next"} />
          </Button>
        </Flexbox>
      </form>
    </Modal.Content>
  );
}
