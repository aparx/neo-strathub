import { getTeam } from "@/modules/team/actions";
import { PlanOverview } from "@/modules/team/modals/settings/components";
import { BreadcrumbData, Breadcrumbs, Modal } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useMemo } from "react";

export function TeamSettingsModalContent({
  team,
}: {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Settings" }],
    [team],
  );

  return (
    <Modal.Content>
      <Modal.Title>
        <Breadcrumbs breadcrumbs={titlePath} />
        <Modal.Exit />
      </Modal.Title>
      <Modal.Separator />
      <PlanOverview
        color={"primary"}
        name={"Advanced Plan"}
        usage={35}
        canUpgrade
      />
      <Modal.Separator />
    </Modal.Content>
  );
}
