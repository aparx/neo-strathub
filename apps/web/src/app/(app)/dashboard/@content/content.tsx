import { BlueprintCard } from "@/app/(app)/dashboard/@content/_components";
import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import * as css from "./content.css";

export function DashContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>Content {props.type}</DashColumn.Header>
      <DashColumn.Content>
        <ul className={css.list} aria-label={"documents"}>
          {new Array(5).fill(
            <li>
              <BlueprintCard
                teamName={"Example Team"}
                documentName={"Lorem ipsum dolor sit amet"}
                arenaName={"Lorem ipsum dolor"}
                visibility={"private"}
                tags={new Array(6).fill("Foo Bar Baz")}
              />
            </li>,
          )}
        </ul>
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
