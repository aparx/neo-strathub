import { vars } from "@repo/theme";
import { Button, Flexbox, Icon, Text } from "@repo/ui/components";
import { ComponentPropsWithoutRef } from "react";
import { MdVisibility } from "react-icons/md";
import * as css from "./blueprintCard.css";

export interface BlueprintCardData {
  gameName: string;
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
  gameName,
  documentName,
  teamName,
  arenaName,
  tags = EMPTY_ARRAY,
  visibility,
}: BlueprintCardProps) {
  return (
    <article className={css.article}>
      <div style={{ flexGrow: 1, maxWidth: "100%" }}>
        <header className={css.headerContainer}>
          <Icon.Custom
            icon={<MdVisibility />}
            aria-label={`Visibility: ${visibility}`}
          />
          <div className={css.headerColumns}>
            <HeaderElement title={teamName} name={documentName} />
            <HeaderElement title={"Game Map"} name={arenaName} />
          </div>
        </header>
        <div className={css.tagsContainer}>
          <ul className={css.tagList}>
            {tags.map((tag, index) => (
              <TagItem key={index /* OK */} name={tag} />
            ))}
          </ul>
        </div>
      </div>
      <footer className={css.footer}>
        <Button appearance={"icon"}>
          <Icon.Mapped type={"preview"} />
        </Button>
        <Button appearance={"icon"}>
          <Icon.Mapped type={"edit"} />
        </Button>
      </footer>
    </article>
  );
}

function HeaderElement({ title, name }: { title: string; name: string }) {
  return (
    <Flexbox orient={"vertical"} gap={"sm"}>
      <Text type={"label"} style={{ color: vars.colors.emphasis.low }}>
        {title}
      </Text>
      <Text
        type={"title"}
        size={"sm"}
        data={{ weight: 450 }}
        style={{ color: vars.colors.emphasis.medium }}
      >
        {name}
      </Text>
    </Flexbox>
  );
}

function TagItem({ name }: { name: string }) {
  return (
    <Text asChild type={"label"} size={"sm"}>
      <li className={css.tagItem}>{name}</li>
    </Text>
  );
}
