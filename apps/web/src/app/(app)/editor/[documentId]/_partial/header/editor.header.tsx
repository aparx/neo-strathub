"use client";
import { BackButton } from "@/app/(app)/editor/[documentId]/_partial/header/components";
import { PopoverExpand } from "@/components";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  IconButton,
  Popover,
  Text,
} from "@repo/ui/components";
import Link from "next/link";
import { useEditorContext } from "../../_context";
import * as css from "./editor.header.css";

export function EditorHeader() {
  const [{ blueprint }] = useEditorContext();

  return (
    <Text asChild>
      <header className={css.headerContainer}>
        <div className={css.headerItem({ side: "left" })}>
          <BackButton />
        </div>
        <div className={css.headerItem({ side: "center" })}>
          <BlueprintTitle />
        </div>
        <div className={css.headerItem({ side: "right" })}>
          <Button asChild appearance={"cta"} color={"cta"}>
            <Link href={`/editor/${blueprint.id}/preview`}>
              Preview
              <Icon.Mapped type={"next"} />
            </Link>
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
            <PopoverExpand>
              <Flexbox align={"center"} gap={"md"}>
                {blueprint.name}
              </Flexbox>
            </PopoverExpand>
          </Breadcrumbs>
        </h2>
      </Text>
    </Popover.Root>
  );
}
