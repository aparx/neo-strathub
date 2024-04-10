import { DashColumn } from "../_components";
import {
  SelectorBody,
  SelectorFooter,
  SelectorHeader,
  SelectorProvider,
} from "./_partial";

export function Selector() {
  return (
    <SelectorProvider>
      <DashColumn.Root scroll={"container"}>
        <DashColumn.Header style={{ borderLeft: "unset" }}>
          <SelectorHeader />
        </DashColumn.Header>
        <DashColumn.Content style={{ borderLeft: "unset" }}>
          <SelectorBody />
        </DashColumn.Content>
        <DashColumn.Footer style={{ borderLeft: "unset" }}>
          <SelectorFooter />
        </DashColumn.Footer>
      </DashColumn.Root>
    </SelectorProvider>
  );
}
