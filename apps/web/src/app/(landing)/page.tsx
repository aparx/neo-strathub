import { createServer } from "@/utils/supabase/server";

import { LoginButton } from "@/app/(landing)/_partial/loginButton";
import { Flexbox, Text } from "@repo/ui/components";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = createServer(cookies());

  return (
    <div>
      <Text type={"title"} size={"sm"}>
        Strathub Demo
      </Text>
      <Flexbox gap={"md"}>
        <LoginButton />
      </Flexbox>
    </div>
  );
}
