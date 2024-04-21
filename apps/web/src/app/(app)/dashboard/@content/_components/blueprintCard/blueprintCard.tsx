"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { BlueprintVisibility } from "@/modules/blueprint/components";
import { Enums } from "@/utils/supabase/types";
import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Text } from "@repo/ui/components";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ComponentPropsWithoutRef, forwardRef, useMemo } from "react";
import * as css from "./blueprintCard.css";

export interface BlueprintCardData {
  documentId: string;
  documentName: string;
  teamName: string;
  arenaName: string;
  visibility: Enums<"bp_visibility">;
  tags?: Readonly<string[]>;
}

export type BlueprintCardProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof BlueprintCardData
> &
  BlueprintCardData;

export const BlueprintCard = forwardRef<HTMLDivElement, BlueprintCardProps>(
  function BlueprintCard(props, ref) {
    const {
      documentId,
      documentName,
      teamName,
      arenaName,
      tags = [],
      visibility,
    } = props;

    // TODO create actual href links to the
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const inspectLink = useMemo(() => {
      const newQuery = new URLSearchParams(searchParams);
      newQuery.set(DASHBOARD_QUERY_PARAMS.document, documentId);
      return `${pathname}?${newQuery.toString()}`;
    }, [pathname, searchParams]);

    const editLink = `/app/edit/${documentId}?`;
    const previewLink = `/app/preview/${documentId}`;

    return (
      <article
        ref={ref}
        className={css.root}
        data-id={documentId}
        data-team={teamName}
        data-arena={arenaName}
      >
        <Link
          href={inspectLink}
          style={{ flexGrow: 1, display: "block" }}
          scroll={false}
        >
          <header className={css.headerContainer}>
            <BlueprintVisibility type={visibility} size={"lg"} />
            <div className={css.headerColumns}>
              <HeaderElement title={teamName} name={documentName} />
              <HeaderElement title={"Game Map"} name={arenaName} />
            </div>
          </header>
          <div className={css.tagsContainer}>
            <ul className={css.tagList} aria-label={"tags"}>
              {tags.map((tag, index) => (
                <TagItem key={index /* OK */} content={tag} />
              ))}
            </ul>
          </div>
        </Link>
        <footer className={css.footer}>
          <Button appearance={"icon"} aria-label={"Preview"}>
            <Link href={previewLink}>
              <Icon.Mapped type={"preview"} />
            </Link>
          </Button>
          <Button asChild appearance={"icon"} aria-label={"Edit"}>
            <Link href={editLink}>
              <Icon.Mapped type={"edit"} />
            </Link>
          </Button>
        </footer>
      </article>
    );
  },
);

function HeaderElement({ title, name }: { title: string; name: string }) {
  return (
    <Flexbox orient={"vertical"} gap={"sm"}>
      <Text type={"label"} style={{ color: vars.colors.emphasis.medium }}>
        {title}
      </Text>
      <Text style={{ color: vars.colors.emphasis.high }}>{name}</Text>
    </Flexbox>
  );
}

function TagItem({ content }: { content: string }) {
  return (
    <Text asChild type={"label"} size={"sm"}>
      <li className={css.tagItem}>{content}</li>
    </Text>
  );
}
