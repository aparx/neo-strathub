"use client";
import { useSignIn } from "@/utils/hooks";
import { Button } from "@repo/ui/components";

export function LoginButton() {
  const signIn = useSignIn();
  return <Button onClick={() => signIn()}>Sign in</Button>;
}
