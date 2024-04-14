import { BlueprintVisibility } from "@/modules/blueprint/components";
import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Text } from "@repo/ui/components";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./blueprintCard.css";

export interface BlueprintCardData {
  documentName: string;
  teamName: string;
  arenaName: string;
  visibility: "public" | "private" | "unlisted";
  tags?: Readonly<string[]>;
}

export type BlueprintCardProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof BlueprintCardData
> &
  BlueprintCardData;

const EMPTY_ARRAY = [] as const;

export function BlueprintCard({
  documentName,
  teamName,
  arenaName,
  tags = EMPTY_ARRAY,
  visibility,
}: BlueprintCardProps) {
  return (
    <article className={css.root}>
      <div style={{ flexGrow: 1 }}>
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
      </div>
      <footer className={css.footer}>
        <Button appearance={"icon"} aria-label={"Preview"}>
          <Icon.Mapped type={"preview"} />
        </Button>
        <Button appearance={"icon"} aria-label={"Edit"}>
          <Icon.Mapped type={"edit"} />
        </Button>
      </footer>
    </article>
  );
}

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
