"use server";
import { LogoutButton } from "@/components/logoutButton";
import { getUser } from "@/server";
import { Flexbox } from "@repo/ui/components";
import { cookies } from "next/headers";

export async function SelectorFooter() {
  const user = await getUser(cookies());

  return (
    <Flexbox justify={"space-between"} align={"center"}>
      User: {user?.email}
      <LogoutButton />
    </Flexbox>
  );
}
