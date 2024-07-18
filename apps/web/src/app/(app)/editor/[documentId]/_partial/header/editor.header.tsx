"use client";
import { ZoomButton } from "@/app/(app)/editor/[documentId]/_partial/header/components";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  IconButton,
  Popover,
  Text,
} from "@repo/ui/components";
import Link from "next/link";
import { useEditorContext } from "../../_context";
import * as css from "./editor.header.css";

export function EditorHeader() {
  const [{ blueprint, mode }, updateEditor] = useEditorContext();

  return (
    <Text asChild>
      <header className={css.headerContainer}>
        <div className={css.headerItem({ side: "left" })}>Toolbox</div>
        <div className={css.headerItem({ side: "center" })}>
          <BlueprintTitle />
        </div>
        <div className={css.headerItem({ side: "right" })}>
          <div className={css.zoomButtonContainer}>
            <ZoomButton />
          </div>
          <Button asChild color={"cta"} size="compact" disabled={mode == null}>
            {mode === "edit" ? (
              <Link href={`/editor/${blueprint.id}/preview`}>Preview</Link>
            ) : (
              <Link href={`/editor/${blueprint.id}/edit`}>Edit</Link>
            )}
          </Button>
        </div>
      </header>
    </Text>
  );
}

function BlueprintTitle() {
  const [{ blueprint }] = useEditorContext();

  return (
    <Popover.Root>
      <Text asChild type={"body"}>
        <h2>
          <Breadcrumbs>
            <IconButton asChild>
              <Link href={`/dashboard/${blueprint.book.team.id}`}>
                {blueprint.book.team.name}
              </Link>
            </IconButton>
            <Popover.Expand>
              <Flexbox align="center" gap="md">
                {blueprint.name}
              </Flexbox>
            </Popover.Expand>
          </Breadcrumbs>
        </h2>
      </Text>
    </Popover.Root>
  );
}
