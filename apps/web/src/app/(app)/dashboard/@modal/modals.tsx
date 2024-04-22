import { TeamMembersModal, TeamSettingsModal } from "@/modules/team/modals";
import { Nullish } from "@repo/utils";
import { FC } from "react";

export interface PageModalProps {
  params: Record<string, string>;
  searchParams: Partial<Record<string, string>>;
}

export const MODAL_PAGES = {
  settings: (props) => <TeamSettingsModal {...props} />,
  members: (props) => <TeamMembersModal {...props} />,
} as const satisfies Record<string, FC<PageModalProps>>;

export type ModalPageKey = keyof typeof MODAL_PAGES;

export function isModalPageKey(key: Nullish<string>): key is ModalPageKey {
  return key != null && key in MODAL_PAGES;
}
