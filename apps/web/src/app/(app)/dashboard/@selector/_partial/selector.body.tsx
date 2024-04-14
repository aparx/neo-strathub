"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { Animator, AnimatorRef } from "@repo/ui/animation";
import { Flexbox } from "@repo/ui/components";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ListItem } from "../_components";
import { useItemContext } from "../_context";
import * as css from "./selector.body.css";

export function SelectorBody() {
  const { items } = useItemContext();
  const { active } = useItemContext();
  const pathName = usePathname();
  const params = useParams<Partial<DashboardParams>>();

  useEffect(() => {
    const anyActive = items.find((item) => item && pathName === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathName]);

  const animator = useRef<AnimatorRef>(null);

  useEffect(() => {
    if (params.teamId) animator.current?.play();
    else animator.current?.stop();
  }, [params.teamId]);

  return (
    <Flexbox asChild orient={"vertical"} gap={"sm"}>
      <Animator ref={animator} classes={css.slideIn} asChild>
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <ListItem
                {...item}
                active={active.state === item.href}
                loading={active.state === item.href && pathName !== item.href}
                onClick={() => active.update(item.href)}
              />
            </li>
          ))}
        </ul>
      </Animator>
    </Flexbox>
  );
}
