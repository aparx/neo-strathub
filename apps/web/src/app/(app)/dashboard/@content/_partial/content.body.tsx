"use client";
import {
  BlueprintCard,
  BlueprintCardProps,
} from "@/app/(app)/dashboard/@content/_components";
import { DashColumn } from "@/app/(app)/dashboard/_components";
import {
  GetMyBlueprintsFilters,
  getMyBlueprints,
} from "@/modules/blueprint/actions";
import { Skeleton, Spinner } from "@repo/ui/components";
import { Nullish, nonNull } from "@repo/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as css from "./content.body.css";

export type ContentBodyProps = GetMyBlueprintsFilters;

export function ContentBody(filters: ContentBodyProps) {
  const { items, isLoading, fetchNextPage, isFetchingNextPage } =
    useFetchBlueprints(filters);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll reset is important for performance & UX purposes
    containerRef.current?.scrollTo({ top: 0 });
  }, [filters.bookId, filters.teamId]);

  return (
    <DashColumn.Content ref={containerRef} style={{ height: 1 }}>
      <ul className={css.list} aria-label={"blueprints"}>
        <ItemList items={items ?? []} onLastEntersViewport={fetchNextPage} />
        {isLoading && <SkeletonList />}
        {isFetchingNextPage && (
          <Spinner
            role={"status"}
            aria-live={"assertive"}
            aria-label={"Loading..."}
            style={{ margin: "0 auto" }}
          />
        )}
      </ul>
    </DashColumn.Content>
  );
}

function useFetchBlueprints(queryInput: ContentBodyProps) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: queryInput.cursorId,
      queryKey: ["blueprints", JSON.stringify(queryInput)],
      queryFn: ({ pageParam }) =>
        getMyBlueprints({ ...queryInput, cursorId: pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const items = useMemo(
    () => data?.pages.flatMap((page) => page.data?.filter(nonNull) ?? []),
    [data?.pages],
  );

  return {
    items,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } as const;
}

function SkeletonList() {
  return Array.from({ length: 10 }, (_, index) => (
    <li key={index}>
      <Skeleton height={112} />
    </li>
  ));
}

function ItemList({
  items,
  onLastEntersViewport,
}: {
  items: NonNullable<ReturnType<typeof useFetchBlueprints>["items"]>;
  /** Event (only called once) when the last blueprint enters the viewport */
  onLastEntersViewport?: () => any;
}) {
  return items.map((item, index) => (
    <li key={item.id}>
      <Blueprint
        id={item.id}
        name={item.name}
        teamName={item.book?.team?.name}
        arenaName={item.arena?.name}
        gameName={item.arena?.game?.name}
        visibility={item.visibility}
        tags={item.tags}
        onInView={index == items.length - 1 ? onLastEntersViewport : undefined}
      />
    </li>
  ));
}

function Blueprint({
  id,
  name,
  teamName,
  arenaName,
  gameName,
  visibility,
  tags,
  onInView,
}: {
  id: string;
  name: string;
  teamName: Nullish<string>;
  arenaName: Nullish<string>;
  gameName: Nullish<string>;
  visibility: BlueprintCardProps["visibility"];
  tags: Nullish<string[]>;
  /** Event callback called when this element is in view */
  onInView?: () => any;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView) onInView?.();
  }, [inView]);

  return (
    <BlueprintCard
      ref={onInView != null ? ref : null}
      documentId={id}
      documentName={name}
      teamName={teamName ?? "(deleted)"}
      arenaName={arenaName ?? "(deleted)"}
      visibility={visibility}
      tags={[
        arenaName ?? "(deleted)",
        gameName ?? "(deleted)",
        ...(tags ?? []),
      ]}
    />
  );
}
