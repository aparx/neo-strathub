import { CONTENT_SEARCH_PARAMS } from "@/app/(app)/dashboard/@content/content.utils";
import { SelectorGameImage } from "@/app/(app)/dashboard/@selector/components";
import { DashColumn } from "@/app/(app)/dashboard/_components";
import { BaseContentPathProps } from "@/app/(app)/dashboard/_utils";
import { getBook } from "@/modules/book/actions";
import { Flexbox, Icon, Skeleton, Text } from "@repo/ui/components";
import { IoMdGlobe } from "react-icons/io";
import { MdPeople } from "react-icons/md";
import { ContentBody, ContentHeader } from "./_partial";
import * as css from "./content.css";

interface DashContentProps extends BaseContentPathProps {
  searchParams?: Partial<Record<string, string>>;
}

export async function DashContent({
  teamId,
  bookId,
  searchParams,
}: DashContentProps) {
  const arenaFilter = searchParams?.[CONTENT_SEARCH_PARAMS.filterByArena];
  const filterByArena = arenaFilter?.split(",");

  return (
    <DashColumn.Root>
      <DashColumn.Header>
        <Title teamId={teamId} bookId={bookId} />
        <ContentHeader />
      </DashColumn.Header>
      {/* Deferred DashColumn.Content to `ContentBody` */}
      <ContentBody
        bookId={bookId}
        teamId={teamId}
        filterByName={searchParams?.[CONTENT_SEARCH_PARAMS.filterByName]}
        filterByArena={filterByArena}
      />
    </DashColumn.Root>
  );
}

async function Title({ bookId, teamId }: { teamId?: string; bookId?: string }) {
  if (bookId) {
    const { data: book } = await getBook(bookId);
    if (!book || !book.game) return <Skeleton width={"33%"} />;
    const { game } = book;
    return (
      <Navigation
        icon={<SelectorGameImage src={game.icon} name={game.name} />}
        title={book.name}
      />
    );
  } else if (teamId) {
    return <Navigation icon={<MdPeople />} title={"Team's Blueprints"} />;
  } else {
    return <Navigation icon={<IoMdGlobe />} title={"Global Blueprints"} />;
  }
}

function Navigation({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Flexbox asChild gap={"md"} align={"center"} style={{ overflow: "hidden" }}>
      <Text type={"label"} size={"lg"}>
        <Icon.Custom className={css.headerIcon} icon={icon} />
        <span>{title}</span>
      </Text>
    </Flexbox>
  );
}
