import { BlueprintCard } from "@/app/(app)/dashboard/@content/_components";
import {
  GetMyBlueprintsFilters,
  getMyBlueprints,
} from "@/modules/blueprint/actions";
import { Suspense } from "react";
import * as css from "./content.body.css";

export type ContentBodyProps = GetMyBlueprintsFilters;

export async function ContentBody({ teamId, bookId }: ContentBodyProps) {
  return (
    <ul className={css.list} aria-label={"documents"}>
      <Suspense key={`${teamId}${bookId}`} fallback={"Loading..."}>
        <ItemList teamId={teamId} bookId={bookId} />
      </Suspense>
    </ul>
  );
}

async function ItemList(props: ContentBodyProps) {
  const { data, error } = await getMyBlueprints(props);

  return data?.map(({ id, name, book, arena, visibility, tags }) => (
    <li key={id}>
      <BlueprintCard
        documentId={id}
        documentName={name}
        teamName={book?.team?.name ?? "(deleted)"}
        arenaName={arena?.name ?? "(deleted)"}
        visibility={visibility}
        tags={[
          arena?.name ?? "(deleted)",
          arena?.game?.name ?? "(deleted)",
          ...(tags ?? []),
        ]}
      />
    </li>
  ));
}
