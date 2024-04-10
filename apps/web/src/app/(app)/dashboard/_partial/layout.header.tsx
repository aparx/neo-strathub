import { Breadcrumbs, BreadcrumbsProps, Text } from "@repo/ui/components";
import { useMemo } from "react";
import * as css from "./layout.header.css";

export function LayoutHeader() {
  const breadcrumbs: BreadcrumbsProps["breadcrumbs"] = useMemo(
    () => [
      { href: "/abc/a", display: "Dashboard" },
      { href: "/abc/b", display: "Example Team" },
    ],
    [],
  );

  return (
    <Text className={css.header} type={"label"} size={"lg"}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </Text>
  );
}
