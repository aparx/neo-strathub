import { DashColumn } from "@/app/(app)/dashboard/_components";

export function DashContent() {
  return (
    <DashColumn.Root>
      <DashColumn.Header>Content</DashColumn.Header>
      <DashColumn.Content>List of blueprints</DashColumn.Content>
    </DashColumn.Root>
  );
}
