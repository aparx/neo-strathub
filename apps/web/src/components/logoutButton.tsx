"use client";
import { useSignOut } from "@/utils/hooks";
import { Button } from "@repo/ui/components";

export function LogoutButton() {
  const signOut = useSignOut();
  return (
    <Button onClick={() => signOut()} color={"destructive"}>
      Sign out
    </Button>
  );
}
