"use client";
import { createTeam } from "@/modules/team/actions/createTeam";
import {
  createTeamSchema,
  CreateTeamSchema,
} from "@/modules/team/actions/createTeam.schema";
import {
  GameSelect,
  PlanSelect,
} from "@/modules/team/modals/create/components";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export function CreateTeamModal() {
  const router = useRouter();
  const [state, setState] =
    useState<InferAsync<ReturnType<typeof createTeam>>>();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState, control } =
    useForm<CreateTeamSchema>({
      resolver: zodResolver(createTeamSchema),
    });

  function submit(data: CreateTeamSchema) {
    startTransition(async () => {
      const newState = await createTeam(data);
      if (newState.state !== "success") return setState(newState);
      // Redirect user to the just created team, since success
      await router.replace(`/dashboard/${newState.createdId}`);
    });
  }

  const isLoading = formState.isLoading || isPending;

  return (
    <Modal.Content>
      <Flexbox asChild orient={"vertical"} gap={"lg"}>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Title>
            Create a new team
            <Modal.Exit />
          </Modal.Title>
          <TextField
            {...register("name")}
            disabled={isLoading}
            placeholder={"Name of team (unique)"}
            error={
              formState.errors.name?.message ||
              (state?.state === "error" && state?.error?.name) ||
              null
            }
          />

          <GameSelect
            name={"gameId"}
            control={control}
            rules={{ required: true }}
            defaultValue={(defaultGameId) => defaultGameId}
            disabled={isLoading}
          />

          <PlanSelect
            name={"planId"}
            control={control}
            rules={{ required: true }}
            defaultValue={(defaultPlanId) => defaultPlanId}
            disabled={isLoading}
          />

          <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
            <Modal.Close asChild>
              <Button disabled={isLoading}>Cancel</Button>
            </Modal.Close>
            <Button
              type={"submit"}
              color={"cta"}
              disabled={isLoading || !formState.isValid}
            >
              Create
              {isLoading ? (
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
