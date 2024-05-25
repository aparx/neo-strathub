import { Nullish } from "@repo/utils";

export enum TeamMemberFlags {
  /** Allows to view and interact with documents */
  VIEW_DOCUMENTS = 1,
  /** Allows to create and edit documents */
  MODIFY_DOCUMENTS = 2,
  /** Allows to delete documents */
  DELETE_DOCUMENTS = 4,

  /** Allows to invite, thus add, members to a team */
  ADD_MEMBERS = 8,
  /** Allows to edit members */
  EDIT_MEMBERS = 16,
  /** Allows to remove members (temporarily, until added again) */
  KICK_MEMBERS = 32,

  /** Allows to create and edit books */
  MODIFY_BOOKS = 64,
  /** Allows to delete existing books */
  DELETE_BOOKS = 128,
  /** Allows to view audit log entries */
  VIEW_AUDIT_LOG = 256,

  /** All flags conjoined into one */
  ALL = VIEW_DOCUMENTS |
    MODIFY_DOCUMENTS |
    DELETE_DOCUMENTS |
    ADD_MEMBERS |
    EDIT_MEMBERS |
    KICK_MEMBERS |
    MODIFY_BOOKS |
    DELETE_BOOKS |
    VIEW_AUDIT_LOG,
}

export function hasFlag(mask: Nullish<number>, flag: number) {
  return mask != null && (mask & flag) !== 0;
}

export function setFlag(mask: Nullish<number>, flag: number, active: boolean) {
  return mask != null ? (active ? mask | flag : mask & ~flag) : flag;
}
