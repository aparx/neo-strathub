import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { TeamSettingsModal } from "@/modules/team/modal/settings";
import { Nullish } from "@repo/utils";
import { FC } from "react";
import { PageModalRoot } from "./components";

export interface TeamPageModalProps {
  teamId: string;
  searchParams: Partial<Record<string, string>>;
}

const modalMap = {
  settings: (props) => <TeamSettingsModal {...props} />,
  members: (props) => <TeamSettingsModal {...props} />,
} as const satisfies Record<string, FC<TeamPageModalProps>>;

export type TeamModalType = keyof typeof modalMap;

export default function TeamPage({
  params: { teamId },
  searchParams,
}: {
  params: { teamId: string };
  searchParams: Partial<Record<string, string>>;
}) {
  const modalType = searchParams[DASHBOARD_QUERY_PARAMS.modal];
  if (!isModalKey(modalType)) return null;
  const ModalContent = modalMap[modalType];

  return (
    <PageModalRoot>
      <ModalContent teamId={teamId} searchParams={searchParams} />
    </PageModalRoot>
  );
}

function isModalKey(key: Nullish<string>): key is TeamModalType {
  return key != null && key in modalMap;
}
