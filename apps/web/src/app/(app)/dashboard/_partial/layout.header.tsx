"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { Breadcrumbs, BreadcrumbsProps, Text } from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import * as css from "./layout.header.css";

export function LayoutHeader() {
  const { teamId } = useParams<Partial<DashboardParams>>();

  const breadcrumbs = useMemo(() => {
    const array: BreadcrumbsProps["breadcrumbs"] = [];
    array.push({
      href: "/dashboard",
      display: "Dashboard",
      forceRefetch: true,
    });
    if (teamId)
      // TODO replace `display: teamId` with a custom component (+ dropdown)
      array.push({ href: "/team", display: teamId });
    return array;
  }, [teamId]);

  return (
    <Text className={css.header} type={"label"} size={"lg"}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </Text>
  );
}
