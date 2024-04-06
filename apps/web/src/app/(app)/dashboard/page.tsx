import { AuthButton } from "@/app/(landing)/_partial/authButton";
import { createServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const supabase = createServer(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      Dashboard!
      <AuthButton user={user} />
    </div>
  );
}
