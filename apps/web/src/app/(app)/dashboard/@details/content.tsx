import { DashColumn } from "@/app/(app)/dashboard/_components";
import { ExtendedContentPathProps } from "@/app/(app)/dashboard/_utils";
import { Callout, Skeleton } from "@repo/ui/components";
import { TeamSection } from "./_components";
import * as css from "./content.css";

export async function DetailsContent(props: ExtendedContentPathProps) {
  return (
    <DashColumn.Root asChild>
      <aside>
        <DashColumn.Content className={css.content}>
          <Callout.Warning>
            Warning: Alpha version. Data may be lost.
          </Callout.Warning>
          {props.documentId != null && (
            <Skeleton className={css.previewFadeIn} height={300} outline />
          )}
          {/* TODO: Document/Blueprint Inspector */}
          {props.teamId != null && <TeamSection teamId={props.teamId} />}
        </DashColumn.Content>
      </aside>
    </DashColumn.Root>
  );
}
