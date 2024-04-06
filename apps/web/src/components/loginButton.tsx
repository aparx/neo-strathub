"use client";
import { useSignIn } from "@/utils/hooks";
import { Button } from "@repo/ui/components";
import { MdArrowForward } from "react-icons/md";

export function LoginButton() {
  const signIn = useSignIn();
  return (
    <Button onClick={() => signIn()} color={"cta"} appearance={"cta"}>
      Sign in
      <MdArrowForward />
    </Button>
  );
}
