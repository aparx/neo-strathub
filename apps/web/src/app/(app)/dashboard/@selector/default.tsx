import { DashColumn } from "@/app/(app)/dashboard/_components";
import { getUser } from "@/modules/auth/actions";
import { cookies } from "next/headers";
import {
  SelectorBody,
  SelectorDataProvider,
  SelectorFooter,
  SelectorHeader,
} from "./partial";

export default async function SelectorDefault() {
  const user = await getUser(cookies());
  if (!user) throw new Error("Unauthorized");

  return (
    <SelectorDataProvider user={user}>
      <DashColumn.Root>
        <DashColumn.Header>
          <SelectorHeader />
        </DashColumn.Header>
        <DashColumn.Content>
          <SelectorBody />
        </DashColumn.Content>
        <DashColumn.Footer>
          <SelectorFooter />
        </DashColumn.Footer>
      </DashColumn.Root>
    </SelectorDataProvider>
  );
}
