import { AuthButton } from "@/app/(landing)/_partial/authButton";
import { createServer } from "@/utils/supabase/server";

import { Flexbox, Text } from "@repo/ui/components";
import { cookies } from "next/headers";

export default async function Page() {
  const supabase = createServer(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <Text type={"title"} size={"sm"}>
        Strathub Demo
      </Text>
      <Flexbox gap={"md"}>
        <AuthButton user={user} />
      </Flexbox>
    </div>
  );
}
