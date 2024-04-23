import { getTeam } from "@/modules/team/actions";
import { PlanOverview } from "@/modules/team/modals/settings/components";
import { BreadcrumbData, Breadcrumbs, Modal } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { useMemo } from "react";
import * as css from "./content.css";

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
      <div className={css.gradient({ color: "secondary" })} />
      <Modal.Title>
        <Breadcrumbs breadcrumbs={titlePath} />
        <Modal.Exit />
      </Modal.Title>
      <PlanOverview
        color={"secondary"}
        name={"Professional Plan"}
        usage={35}
        canUpgrade
      />
      <div>Fields</div>
    </Modal.Content>
  );
}
