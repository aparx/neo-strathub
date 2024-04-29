import { Nullish } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./userField.css";

// TODO separate out this component (if reused elsewhere)

type UserFieldBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface UserFieldData {
  username: Nullish<string>;
  avatar?: Nullish<string>;
}

export interface UserFieldProps extends UserFieldBaseProps, UserFieldData {
  /** Highlighted, as in it is the user itself or has prioritization */
  highlight?: boolean;
}

export function UserField({
  username,
  avatar,
  highlight,
  ...restProps
}: UserFieldProps) {
  return (
    <figure className={css.field({ highlight })} {...restProps}>
      {avatar ? null /* TODO */ : <div className={css.avatar} />}
      <figcaption>{username ?? "(Deleted)"}</figcaption>
    </figure>
  );
}
