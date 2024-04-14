"use server";
import { getUser } from "@/modules/auth/actions";
import { AuthButton } from "@/modules/auth/components";
import { Flexbox } from "@repo/ui/components";
import { cookies } from "next/headers";

export async function SelectorFooter() {
  const user = await getUser(cookies());

  return (
    <Flexbox justify={"space-between"} align={"center"}>
      User: {user?.email}
      <AuthButton.Logout />
    </Flexbox>
  );
}
