import { DashColumn } from "@/app/(app)/dashboard/_components";
import { SharedContentProps } from "@/app/(app)/dashboard/_utils";
import { getBook } from "@/modules/book/actions";
import { Flexbox, Icon, Text } from "@repo/ui/components";
import { MdGames } from "react-icons/md";
import { ContentBody, ContentHeader } from "./_partial";
import * as css from "./content.css";

export async function DashContent(props: SharedContentProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>
        {props.type === "collection" ? (
          <BookName bookId={props.bookId} />
        ) : null}
        <ContentHeader />
      </DashColumn.Header>
      <DashColumn.Content>
        <ContentBody />
      </DashColumn.Content>
    </DashColumn.Root>
  );
}

async function BookName({ bookId }: { bookId: string }) {
  const book = await getBook(bookId); // TODO error handling
  return (
    <Flexbox gap={"md"} align={"center"}>
      <Icon.Custom className={css.headerBookIcon} icon={<MdGames />} />
      <Text type={"label"} size={"lg"}>
        {book.name}
      </Text>
    </Flexbox>
  );
}
