"use client";
import { PopoverExpand } from "@/components";
import { useTeam } from "@/modules/team/clientActions";
import { TeamPopover } from "@/modules/team/partial";
import { vars } from "@repo/theme";
import { Breadcrumbs, Popover, Skeleton, Text } from "@repo/ui/components";
import { calc } from "@vanilla-extract/css-utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as css from "./layout.header.css";

export function LayoutHeader() {
  return (
    <Text asChild className={css.header} type={"label"} size={"lg"}>
      <header>
        <Navigation />
      </header>
    </Text>
  );
}

function Navigation() {
  const { teamId } = useParams<{ teamId?: string }>();

  return (
    <nav style={{ overflow: "hidden" }}>
      <Breadcrumbs>
        <Link href={"/dashboard"}>Dashboard</Link>
        {teamId && <TeamButton teamId={teamId} />}
      </Breadcrumbs>
    </nav>
  );
}

function TeamButton({ teamId }: { teamId: string }) {
  const { data } = useTeam(teamId);
  const name = data?.name;
  if (!name?.length)
    return (
      <Skeleton
        width={125}
        height={calc.add(
          vars.fontSizes.body.md,
          calc.multiply(2, vars.spacing.sm),
        )}
      />
    );
  return (
    <Popover.Root>
      <PopoverExpand>{name}</PopoverExpand>
      {data != null && (
        <TeamPopover teamId={data.id} style={{ minWidth: 250 }} />
      )}
    </Popover.Root>
  );
}
