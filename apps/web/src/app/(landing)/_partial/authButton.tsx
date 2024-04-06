"use client";
import { useSignIn, useSignOut } from "@/utils/hooks";
import { Button } from "@repo/ui/components";
import { User } from "@supabase/supabase-js";

export function AuthButton({ user }: { user: User | null }) {
  const signOut = useSignOut();
  const signIn = useSignIn();

  return user ? (
    <Button color={"destructive"} onClick={signOut}>
      Logout
    </Button>
  ) : (
    <Button appearance={"cta"} color={"cta"} onClick={() => signIn()}>
      Login
    </Button>
  );
}
