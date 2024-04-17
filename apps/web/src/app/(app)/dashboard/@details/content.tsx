import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import { Callout, Skeleton } from "@repo/ui/components";
import { Suspense } from "react";
import { TeamSection } from "./_components";
import * as css from "./content.css";

export async function DetailsContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Content className={css.content}>
        <Callout.Warning>
          Warning: Alpha version. Data may be lost.
        </Callout.Warning>
        {props.documentId != null && (
          <Skeleton className={css.previewFadeIn} height={300} outline />
        )}
        {/* TODO: Document/Blueprint Inspector */}
        {props.type !== "overview" && (
          <Suspense key={props.teamId} fallback={"Loading Team..."}>
            <TeamSection teamId={props.teamId} />
          </Suspense>
        )}
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
