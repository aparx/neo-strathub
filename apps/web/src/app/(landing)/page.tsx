import { AuthButton } from "@/modules/auth/components";
import { createAnonServer } from "@/utils/supabase/server";
import { Flexbox, Text } from "@repo/ui/components";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = createAnonServer(cookies());

  return (
    <div>
      <Text type={"title"} size={"sm"}>
        Strathub Demo
      </Text>
      <Flexbox gap={"md"}>
        <AuthButton.Login />
      </Flexbox>
    </div>
  );
}
