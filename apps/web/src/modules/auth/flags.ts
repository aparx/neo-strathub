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

  /** All flags conjoined into one */
  ALL = VIEW_DOCUMENTS |
    MODIFY_DOCUMENTS |
    DELETE_DOCUMENTS |
    ADD_MEMBERS |
    EDIT_MEMBERS |
    KICK_MEMBERS,
}
