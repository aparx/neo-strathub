import { DashColumn } from "@/app/(app)/dashboard/_components";
import { ExtendedContentPathProps } from "@/app/(app)/dashboard/_utils";
import { getBook } from "@/modules/book/actions";
import { Flexbox, Icon, Text } from "@repo/ui/components";
import { IoMdGlobe } from "react-icons/io";
import { MdGames, MdPeople } from "react-icons/md";
import { ContentBody, ContentHeader } from "./_partial";
import * as css from "./content.css";

export async function DashContent(props: ExtendedContentPathProps) {
  return (
    <DashColumn.Root>
      <DashColumn.Header>
        <Title {...props} />
        <ContentHeader />
      </DashColumn.Header>
      <DashColumn.Content style={{ height: 1 }}>
        <ContentBody bookId={props.bookId} teamId={props.teamId} />
      </DashColumn.Content>
    </DashColumn.Root>
  );
}

async function Title(props: ExtendedContentPathProps) {
  if (props.bookId) {
    const book = await getBook(props.bookId);
    return <Navigation icon={<MdGames />} title={book.name} />;
  } else if (props.teamId) {
    return <Navigation icon={<MdPeople />} title={"Team's Blueprints"} />;
  } else {
    return <Navigation icon={<IoMdGlobe />} title={"Global Blueprints"} />;
  }
}

function Navigation({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Flexbox asChild gap={"md"} align={"center"}>
      <Text type={"label"} size={"lg"}>
        <Icon.Custom className={css.headerIcon} icon={icon} />
        {title}
      </Text>
    </Flexbox>
  );
}
