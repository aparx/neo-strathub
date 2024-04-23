import { TeamMembersModal, TeamSettingsModal } from "@/modules/team/modals";
import { Nullish } from "@repo/utils";
import { FC } from "react";

export const MODAL_PAGES = {
  settings: () => <TeamSettingsModal />,
  members: () => <TeamMembersModal />,
} as const satisfies Record<string, FC>;

export type ModalPageKey = keyof typeof MODAL_PAGES;

export function isModalPageKey(key: Nullish<string>): key is ModalPageKey {
  return key != null && key in MODAL_PAGES;
}
