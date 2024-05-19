import { BackButton } from "@/app/(app)/editor/[documentId]/_partial/header/components";
import { PopoverExpand } from "@/components";
import { DefaultBlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Popover,
  Text,
} from "@repo/ui/components";
import * as css from "./editor.header.css";

export async function EditorHeader({
  blueprint,
}: {
  blueprint: DefaultBlueprintData;
}) {
  return (
    <Text>
      <div className={css.headerContainer}>
        <div className={css.headerItem({ side: "left" })}>
          <BackButton />
        </div>
        <div className={css.headerItem({ side: "center" })}>
          <BlueprintTitle blueprint={blueprint} />
        </div>
        <div className={css.headerItem({ side: "right" })}>
          <Button appearance={"cta"} color={"cta"}>
            Preview
            <Icon.Mapped type={"next"} />
          </Button>
        </div>
      </div>
    </Text>
  );
}

function BlueprintTitle({ blueprint }: { blueprint: DefaultBlueprintData }) {
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
