import { CreateBookModal } from "@/modules/book/modals";
import {
  AuditLogModal,
  CreateTeamModal,
  TeamMembersModal,
  TeamSettingsModal,
} from "@/modules/team/modals";
import { TeamLeaveModal } from "@/modules/team/modals/leave/modal";
import { Nullish } from "@repo/utils";
import { FC } from "react";

export const MODAL_PAGES = {
  settings: () => <TeamSettingsModal />,
  leave: () => <TeamLeaveModal />,
  members: () => <TeamMembersModal />,
  auditLog: () => <AuditLogModal />,
  createTeam: () => <CreateTeamModal />,
  createBook: () => <CreateBookModal />,
} as const satisfies Record<string, FC>;

export type ModalPageKey = keyof typeof MODAL_PAGES;

export function isModalPageKey(key: Nullish<string>): key is ModalPageKey {
  return key != null && key in MODAL_PAGES;
}
