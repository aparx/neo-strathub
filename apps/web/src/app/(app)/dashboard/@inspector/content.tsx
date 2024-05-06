import { ExtendedContentPathProps } from "@/app/(app)/dashboard/_utils";
import { Skeleton } from "@repo/ui/components";
import * as css from "./content.css";

export function PreviewContent(props: ExtendedContentPathProps) {
  if (!props.documentId) return null;

  return (
    <div style={{ height: 500 }} className={css.previewFadeIn}>
      <Skeleton height={"100%"} outline />
    </div>
  );
}
