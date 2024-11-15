import { UseGetTeamFromParamsResultData } from "@/modules/modal/hooks";
import {
  PlanOverview,
  SettingField,
} from "@/modules/team/modals/settings/components";
import { formatCurrency } from "@/utils/generic";
import {
  Breadcrumbs,
  Button,
  Flexbox,
  Icon,
  Modal,
  TextField,
} from "@repo/ui/components";
import { capitalize } from "@repo/utils";
import * as css from "./content.css";

export function TeamSettingsModalContent(
  team: NonNullable<UseGetTeamFromParamsResultData>,
) {
  const pricing = team.plan?.pricing ?? 0;
  const priceTag = pricing > 0 ? `${formatCurrency(pricing)} / month` : "Free";

  return (
    <Modal.Content minWidth={500}>
      <div className={css.gradient({ color: "primary" })} />
      <Modal.Title>
        <Breadcrumbs>
          {team.name}
          Settings
        </Breadcrumbs>
        <Modal.Exit />
      </Modal.Title>

      <PlanOverview
        color={"primary"}
        pricing={priceTag}
        name={capitalize(team.plan?.name) ?? "Basic"}
        usage={35}
        canUpgrade
      />

      <SettingsForm {...team} />
    </Modal.Content>
  );
}

function SettingsForm(team: NonNullable<UseGetTeamFromParamsResultData>) {
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
      <Flexbox gap={"md"} style={{ marginLeft: "auto" }}>
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
