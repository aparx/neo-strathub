import { Flexbox } from "@repo/ui/components";
import {
  SelectorBody,
  SelectorFooter,
  SelectorHeader,
  SelectorProvider,
} from "./_partial";

export function Selector() {
  // TODO fetch initial items (such as teams or books etc.)
  return (
    <SelectorProvider>
      <Flexbox orient={"vertical"} justify={"space-between"} gap={"md"}>
        <Flexbox orient={"vertical"}>
          <Flexbox
            align={"center"}
            style={{
              minHeight: 57 - 20,
              padding: `10px 0`,
            }}
          >
            <SelectorHeader />
          </Flexbox>
          <SelectorBody />
        </Flexbox>
        <SelectorFooter />
      </Flexbox>
    </SelectorProvider>
  );
}
