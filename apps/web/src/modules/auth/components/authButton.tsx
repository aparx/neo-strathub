"use client";
import { useSignIn, useSignOut } from "@/utils/hooks";
import { Button } from "@repo/ui/components";
import { MdArrowForward } from "react-icons/md";

export function Login() {
  const signIn = useSignIn();
  return (
    <Button onClick={() => signIn()} color={"cta"} appearance={"cta"}>
      Sign in
      <MdArrowForward />
    </Button>
  );
}

export function Logout() {
  const signOut = useSignOut();
  return (
    <Button onClick={() => signOut()} color={"destructive"}>
      Sign out
    </Button>
  );
}
