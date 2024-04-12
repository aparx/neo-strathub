import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import { Suspense } from "react";
import { TeamSection } from "./_components";

export async function DetailsContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Content>
        {props.type !== "overview" && (
          <Suspense key={props.teamId} fallback={"Loading Team..."}>
            <TeamSection teamId={props.teamId} />
          </Suspense>
        )}
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
