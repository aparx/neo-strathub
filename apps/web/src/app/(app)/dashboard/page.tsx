import { getServer, getUser } from "@/server";
import { Flexbox } from "@repo/ui/components";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const supabase = await getServer(cookies());
  const user = await getUser(cookies());

  if (!user) {
    // Should be impossible to hit, but just-in-case
    throw new Error("Must be logged in");
  }

  return (
    <Flexbox gap={"lg"} align={"center"}>
      Dashboard!
      <Test />
    </Flexbox>
  );
}

async function Test() {
  const user = await getUser(cookies());
  return <div />;
}
