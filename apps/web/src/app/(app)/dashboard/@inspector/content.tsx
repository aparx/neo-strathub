"use server";
import { InspectorHeader } from "@/app/(app)/dashboard/@inspector/_partial";
import { ExtendedContentPathProps } from "@/app/(app)/dashboard/_utils";
import { Skeleton } from "@repo/ui/components";
import { Suspense } from "react";
import * as css from "./content.css";

export async function InspectorContent(props: ExtendedContentPathProps) {
  if (!props.documentId) return null;

  return (
    <section className={css.container}>
      <Suspense fallback={"Loading..."}>
        <InspectorHeader documentId={props.documentId} />
      </Suspense>
      <Skeleton height={225} outline roundness={"md"} />
    </section>
  );
}
