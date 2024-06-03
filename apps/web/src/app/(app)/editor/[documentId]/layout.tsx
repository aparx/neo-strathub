import { EditorContextProvider } from "@/app/(app)/editor/[documentId]/_context";
import {
  EditorCharacters,
  EditorHeader,
} from "@/app/(app)/editor/[documentId]/_partial";
import { FullPageEditorSpinner } from "@/app/(app)/editor/[documentId]/page";
import { getBlueprint } from "@/modules/blueprint/actions/getBlueprint";
import { EditorEventHandler } from "@/modules/editor/features/events";
import React, { Suspense } from "react";
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
      <Content documentId={params.documentId}>{children}</Content>
    </Suspense>
  );
}

async function Content({
  children,
  documentId,
}: {
  children: React.ReactNode;
  documentId: string;
}) {
  const document = await getBlueprint(documentId);
  if (document.state === "error") throw new Error(document.error.message);
  if (!document.data) throw new Error("Could not find blueprint");
  const blueprint = document.data;

  return (
    <EditorContextProvider blueprint={blueprint}>
      <EditorEventHandler>
        <div className={css.content}>
          <EditorHeader blueprint={blueprint} />
          <EditorCharacters blueprint={blueprint} />
          {/*<EditorInspector />*/}
          <main>{children}</main>
        </div>
      </EditorEventHandler>
    </EditorContextProvider>
  );
}
