import { DashColumn } from "@/app/(app)/dashboard/_components";

export type ContentProps =
  | {
      type: "team";
      teamId: string;
    }
  | {
      type: "collection";
      teamId: string;
      bookId: string;
    }
  | {
      type: "overview";
    };

export function DashContent(props: ContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>Content {props.type}</DashColumn.Header>
      <DashColumn.Content>List of blueprints</DashColumn.Content>
    </DashColumn.Root>
  );
}
