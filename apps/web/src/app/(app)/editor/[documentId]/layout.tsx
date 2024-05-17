import {
  EditorCharacters,
  EditorHeader,
} from "@/app/(app)/editor/[documentId]/_partial";
import * as css from "./layout.css";

export default async function EditorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { documentId: string };
}) {
  return (
    <div className={css.content}>
      <EditorHeader blueprintId={params.documentId} />
      <EditorCharacters />
      {children}
    </div>
  );
}
