import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import { Callout } from "@repo/ui/components";
import { Suspense } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { TeamSection } from "./_components";

export async function DetailsContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Content>
        <Callout.Base icon={<RiErrorWarningLine />} color={"warning"}>
          This is an alpha version
        </Callout.Base>
        {props.type !== "overview" && (
          <Suspense key={props.teamId} fallback={"Loading Team..."}>
            <TeamSection teamId={props.teamId} />
          </Suspense>
        )}
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
