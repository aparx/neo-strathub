"use client";
import { useTeam } from "@/modules/team/clientActions";
import { TeamPopover } from "@/modules/team/partial";
import { vars } from "@repo/theme";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Icon,
  IconButton,
  Popover,
  Skeleton,
  Text,
} from "@repo/ui/components";
import { calc } from "@vanilla-extract/css-utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MdExpandMore } from "react-icons/md";
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

  const breadcrumbs = useMemo(() => {
    const array: BreadcrumbsProps["crumbs"] = [];
    array.push(<Link href={"/dashboard"}>Dashboard</Link>);
    if (teamId)
      // TODO replace `display: teamId` with a custom component (+ dropdown)
      array.push(<TeamButton teamId={teamId} />);
    return array;
  }, [teamId]);

  return (
    <nav style={{ overflow: "hidden" }}>
      <Breadcrumbs crumbs={breadcrumbs} />
    </nav>
  );
}

function TeamButton({ teamId }: { teamId: string }) {
  const { data } = useTeam(teamId);
  const [state, setState] = useState(false);
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
    <Popover.Root onOpenChange={setState}>
      <Popover.Trigger asChild>
        <IconButton
          className={css.teamButtonShell}
          style={{
            color: vars.colors.emphasis.high,
            fontWeight: "inherit",
          }}
        >
          {name}
          <Icon.Custom
            className={css.teamButtonIcon}
            style={{ rotate: state ? "-180deg" : "unset" }}
          >
            <MdExpandMore />
          </Icon.Custom>
        </IconButton>
      </Popover.Trigger>
      {data != null && (
        <TeamPopover teamId={data.id} style={{ minWidth: 250 }} />
      )}
    </Popover.Root>
  );
}
