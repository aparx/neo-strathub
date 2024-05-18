import {
  EditorCharacters,
  EditorHeader,
} from "@/app/(app)/editor/[documentId]/_partial";
import { FullPageEditorSpinner } from "@/app/(app)/editor/[documentId]/page";
import { Suspense } from "react";
import * as css from "./layout.css";

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { documentId: string };
}) {
  return (
    <Suspense fallback={<FullPageEditorSpinner />}>
      <div className={css.content}>
        <EditorHeader blueprintId={params.documentId} />
        <EditorCharacters blueprintId={params.documentId} />
        {children}
      </div>
    </Suspense>
  );
}
