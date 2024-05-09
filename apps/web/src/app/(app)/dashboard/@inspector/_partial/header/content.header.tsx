import { ExitInspectorButton } from "@/app/(app)/dashboard/@inspector/_partial/header/components";
import { SelectorGameImage } from "@/app/(app)/dashboard/@selector/components";
import { getServer } from "@/utils/supabase/actions";
import { vars } from "@repo/theme";
import { DragScrollArea, Flexbox, Icon, Text } from "@repo/ui/components";
import { cookies } from "next/headers";
import * as css from "./content.header.css";

export async function InspectorHeader({ documentId }: { documentId: string }) {
  const { data, error } = await getServer(cookies())
    .from("blueprint")
    .select(
      `name, visibility, tags,
       arena!inner(id, name, game!inner(name, icon)),
       book!inner(id, name, team!inner(id, name))`,
    )
    .eq("id", documentId)
    .maybeSingle();

  // Always include the arena name first within the tags
  const tags = data ? [data.arena.name, ...(data.tags ?? [])] : null;

  if (!data) {
    console.error("Error", error); // TODO
    return null;
  }
  return (
    <header className={css.header}>
      <Flexbox gap={"lg"} style={{ position: "relative" }}>
        <Icon.Custom className={css.game}>
          <SelectorGameImage
            src={data.arena.game.icon}
            name={data.arena.game.name}
          />
        </Icon.Custom>
        <Flexbox asChild orient={"vertical"} gap={"sm"}>
          <hgroup>
            <Text asChild type={"title"} size={"sm"}>
              <h2>{data.name}</h2>
            </Text>
            <Text asChild style={{ color: vars.colors.emphasis.medium }}>
              <h3>By {data.book.team.name}</h3>
            </Text>
          </hgroup>
        </Flexbox>
        <ExitInspectorButton className={css.exit} />
      </Flexbox>
      {tags && <TagList tags={tags} />}
      <div>{data.visibility}</div>
    </header>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <DragScrollArea asChild>
      <ul className={css.tags}>
        {tags.map((tag, index) => (
          <Text asChild type={"label"}>
            <li key={index /* OK */} className={css.tag}>
              {tag}
            </li>
          </Text>
        ))}
      </ul>
    </DragScrollArea>
  );
}
