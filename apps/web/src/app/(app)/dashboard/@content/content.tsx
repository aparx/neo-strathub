import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";

export function DashContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>Content {props.type}</DashColumn.Header>
      <DashColumn.Content>List of blueprints</DashColumn.Content>
    </DashColumn.Root>
  );
}
