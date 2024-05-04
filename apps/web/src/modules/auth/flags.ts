import { Nullish } from "@repo/utils";

export enum TeamMemberFlags {
  /** Allows to view and interact with documents */
  VIEW_DOCUMENTS = 2 ** 0,
  /** Allows to create and edit documents */
  MODIFY_DOCUMENTS = 2 ** 1,
  /** Allows to delete documents */
  DELETE_DOCUMENTS = 2 ** 2,

  /** Allows to invite, thus add, members to a team */
  ADD_MEMBERS = 2 ** 3,
  /** Allows to edit members */
  EDIT_MEMBERS = 2 ** 4,
  /** Allows to remove members (temporarily, until added again) */
  KICK_MEMBERS = 2 ** 5,

  /** Allows to create and edit books */
  MODIFY_BOOKS = 2 ** 6,
  /** Allows to delete existing books */
  DELETE_BOOKS = 2 ** 7,

  /** All flags conjoined into one */
  ALL = VIEW_DOCUMENTS |
    MODIFY_DOCUMENTS |
    DELETE_DOCUMENTS |
    ADD_MEMBERS |
    EDIT_MEMBERS |
    KICK_MEMBERS |
    MODIFY_BOOKS |
    DELETE_BOOKS,
}

export function hasFlag(mask: Nullish<number>, flag: number) {
  return mask != null && (mask & flag) !== 0;
}

export function setFlag(mask: Nullish<number>, flag: number, active: boolean) {
  return mask != null ? (active ? mask | flag : mask & ~flag) : flag;
}
