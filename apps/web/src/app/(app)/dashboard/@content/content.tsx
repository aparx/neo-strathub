import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import { ContentBody, ContentHeader } from "./_partial";

export async function DashContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>
        <ContentHeader />
      </DashColumn.Header>
      <DashColumn.Content>
        <ContentBody />
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
