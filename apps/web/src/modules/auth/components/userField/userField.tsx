import { Avatar } from "@/modules/auth/components";
import { Tables } from "@/utils/supabase/types";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./userField.css";

type UserFieldBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface UserFieldProps extends UserFieldBaseProps {
  profile: Pick<Tables<"profile">, "id" | "username" | "avatar">;
  /** @default "1.3em" */
  avatarSize?: string;
}

/**
 * A component that represents a user by displaying their avatar and username
 * semantically next to each other.
 *
 * @param id
 * @param profile
 * @param avatarSize
 * @param restProps
 * @constructor
 */
export function UserField({
  id,
  profile,
  avatarSize = "1.3em",
  ...restProps
}: UserFieldProps) {
  return (
    <figure data-user-id={id} className={css.field} {...restProps}>
      <Avatar size={avatarSize} src={profile.avatar} />
      <figcaption>{profile.username ?? "(Deleted)"}</figcaption>
    </figure>
  );
}
