import { PopoverExpand } from "@/components";
import { getBlueprint } from "@/modules/blueprint/actions/getBlueprint";
import { Breadcrumbs, Flexbox, Popover, Text } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import * as css from "./editor.header.css";

type BlueprintData = NonNullable<
  InferAsync<ReturnType<typeof getBlueprint>>["data"]
>;

export async function EditorHeader({ blueprintId }: { blueprintId: string }) {
  const blueprint = await getBlueprint(blueprintId);
  if (blueprint.state === "error") throw new Error(blueprint.error.message);
  if (!blueprint.data) throw new Error("Could not find blueprint");

  return (
    <Text>
      <div className={css.headerBackground}>
        <div className={css.headerItem({ side: "left" })}>Hello</div>
        <div className={css.headerItem({ side: "center" })}>
          <BlueprintTitle blueprint={blueprint.data} />
        </div>
        <div className={css.headerItem({ side: "right" })}>World</div>
      </div>
    </Text>
  );
}

function BlueprintTitle({ blueprint }: { blueprint: BlueprintData }) {
  return (
    <Popover.Root>
      <Text asChild type={"body"}>
        <h2>
          <Breadcrumbs>
            {blueprint.book.team.name}
            <PopoverExpand>
              <Flexbox align={"center"} gap={"md"}>
                {blueprint.name}
              </Flexbox>
            </PopoverExpand>
          </Breadcrumbs>
        </h2>
      </Text>
    </Popover.Root>
  );
}
