"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { createProfile } from "@/app/(landing)/signup/actions";
import * as css from "@/app/(landing)/signup/page.css";
import { AuthButton } from "@/modules/auth/components";
import { ModalPageKey } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import {
  Button,
  Flexbox,
  Icon,
  Spinner,
  Text,
  TextField,
} from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { PostgresError } from "pg-error-enum";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

export function SignupNameForm({ user }: { user: User }) {
  const [state, dispatch] = useFormState(createProfile, null);

  let fieldError: Nullish | string[] | string;

  if (state?.state === "error") {
    if (state.message) fieldError = state.message?.name;
    else if (state.error?.code === PostgresError.UNIQUE_VIOLATION)
      fieldError = "This name is already taken";
  }

  const router = useRouter();
  const url = useURL();

  useEffect(() => {
    if (state?.state !== "success") return;
    const redirect = url.searchParams.get("redirect");
    if (redirect && !["/home", "/dashboard"].includes(redirect))
      return router.replace(redirect);
    url.pathname = "/dashboard";
    url.searchParams.forEach((_, key) => url.searchParams.delete(key));
    url.searchParams.set(
      DASHBOARD_QUERY_PARAMS.modal,
      "createTeam" satisfies ModalPageKey,
    );
    router.replace(url.href);
  }, [state]);

  return (
    <form action={dispatch} className={css.formShell}>
      <Flexbox orient={"vertical"} gap={"sm"}>
        <Text>Please choose a name</Text>
        <TextField
          name={"name"}
          placeholder={"name"}
          defaultValue={user.user_metadata.name}
          error={fieldError}
          required
        />
      </Flexbox>
      <Footer loading={state?.state === "success"} />
    </form>
  );
}

function Footer({ loading }: { loading?: boolean }) {
  const isPendingOrLoading = useFormStatus().pending || loading;
  return (
    <footer className={css.footer}>
      <AuthButton.SignOut>Sign out</AuthButton.SignOut>
      <Button type={"submit"} color={"cta"} disabled={isPendingOrLoading}>
        Continue
        {isPendingOrLoading ? (
          <Spinner color={"inherit"} />
        ) : (
          <Icon.Mapped type={"next"} />
        )}
      </Button>
    </footer>
  );
}
