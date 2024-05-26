"use client";
import {
  CreateProfileSchema,
  createProfileSchema,
} from "@/app/(landing)/signup/actions/createProfile.schema.ts";
import { createProfile } from "@/app/(landing)/signup/actions/createProfile.ts";
import * as css from "@/app/(landing)/signup/page.css";
import { AuthButton, Avatar } from "@/modules/auth/components";
import {
  MODAL_CONTROLLER_ID_PARAM,
  ModalParameter,
} from "@/modules/modal/components/index.ts";
import { ModalPageKey } from "@/modules/modal/modals.tsx";
import { useURL } from "@/utils/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flexbox, Icon, Spinner, TextField } from "@repo/ui/components";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PostgresError } from "pg-error-enum";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

export function SignupNameForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState, setError, setFocus } =
    useForm<CreateProfileSchema>({
      resolver: zodResolver(createProfileSchema),
    });
  const router = useRouter();
  const url = useURL();
  const metadata = user.user_metadata;

  function submit(data: CreateProfileSchema) {
    startTransition(async () => {
      const { error } = await createProfile(data);
      console.log(error);
      if (error?.code === PostgresError.UNIQUE_VIOLATION) {
        setError("name", { message: "Username exists already" });
      } else if (error) {
        setError("name", { message: error.message });
      } else {
        const redirect = url.searchParams.get("redirect");
        if (redirect && !["/home", "/dashboard"].includes(redirect))
          return router.replace(redirect);
        url.pathname = "/dashboard";
        url.searchParams.forEach((_, key) => url.searchParams.delete(key));
        ModalParameter.apply(
          url.searchParams,
          MODAL_CONTROLLER_ID_PARAM,
          "createTeam" satisfies ModalPageKey,
        );
        router.replace(url.href);
      }
    });
  }

  useEffect(() => setFocus("name"), []);

  return (
    <form className={css.formShell} onSubmit={handleSubmit(submit)}>
      <Flexbox gap={"lg"}>
        <Avatar size={"40px"} src={metadata.avatar_url} />
        <TextField
          {...register("name")}
          placeholder={"Choose a username"}
          defaultValue={
            process.env.NODE_ENV === "development"
              ? metadata.name?.replaceAll(/\s/gi, "_")
              : undefined
          }
          style={{ flexGrow: 1 }}
          error={formState.errors.name?.message}
          disabled={isPending}
          autoComplete={false}
        />
      </Flexbox>
      <footer className={css.footer}>
        <AuthButton.SignOut disabled={isPending}>Sign out</AuthButton.SignOut>
        <Button
          type={"submit"}
          color={"cta"}
          disabled={isPending || !formState.isValid}
        >
          Continue
          {isPending ? (
            <Spinner color={"inherit"} />
          ) : (
            <Icon.Mapped type={"next"} />
          )}
        </Button>
      </footer>
    </form>
  );
}
