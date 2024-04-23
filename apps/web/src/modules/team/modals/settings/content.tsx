import { getTeam } from "@/modules/team/actions";
import {
  PlanOverview,
  SettingField,
} from "@/modules/team/modals/settings/components";
import {
  BreadcrumbData,
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Modal,
  TextField,
} from "@repo/ui/components";
import { InferAsync, capitalize } from "@repo/utils";
import { useMemo } from "react";
import * as css from "./content.css";

interface TeamSettingsModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

export function TeamSettingsModalContent({ team }: TeamSettingsModalProps) {
  const titlePath: BreadcrumbData[] = useMemo(
    () => [{ display: team.name }, { display: "Settings" }],
    [team],
  );

  const pricing = team.plan?.pricing ?? 0;
  const priceTag = pricing > 0 ? `$${pricing} / month` : "Free";

  return (
    <Modal.Content>
      <div className={css.gradient({ color: "primary" })} />
      <Modal.Title>
        <Breadcrumbs breadcrumbs={titlePath} />
        <Modal.Exit />
      </Modal.Title>

      <PlanOverview
        color={"primary"}
        pricing={priceTag}
        name={capitalize(team.plan?.name) ?? "Basic"}
        usage={35}
        canUpgrade
      />

      <Modal.Separator />

      <SettingsForm team={team} />
    </Modal.Content>
  );
}

function SettingsForm({ team }: TeamSettingsModalProps) {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "inherit",
      }}
    >
      {/* Content */}
      <Flexbox orient={"vertical"} gap={"sm"}>
        <SettingField.Root>
          <SettingField.Slot>
            <Icon.Mapped type={"tag"} />
            Team ID
          </SettingField.Slot>
          <SettingField.Slot asChild>
            <TextField defaultValue={team.id} disabled />
          </SettingField.Slot>
        </SettingField.Root>

        <SettingField.Root>
          <SettingField.Slot>
            <Icon.Mapped type={"name"} />
            Team Name
          </SettingField.Slot>
          <SettingField.Slot asChild>
            <TextField
              name={"name"}
              placeholder={"Name"}
              defaultValue={team.name}
            />
          </SettingField.Slot>
        </SettingField.Root>
      </Flexbox>

      {/* Footer */}
      <Flexbox gap={"sm"} style={{ marginLeft: "auto" }}>
        <Modal.Close asChild>
          <Button>Cancel</Button>
        </Modal.Close>
        <Button color={"cta"} type={"submit"}>
          Save
          <Icon.Mapped type={"next"} />
        </Button>
      </Flexbox>
    </form>
  );
}
