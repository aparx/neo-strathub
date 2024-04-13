import { getUser } from "@/modules/user/actions";
import { cookies } from "next/headers";
import { DashColumn } from "../_components";
import {
  SelectorBody,
  SelectorDataProvider,
  SelectorFooter,
  SelectorHeader,
} from "./_partial";

export default async function Selector() {
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
