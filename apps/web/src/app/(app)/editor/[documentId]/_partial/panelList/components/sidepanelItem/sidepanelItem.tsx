"use client";
import { Flexbox, Icon, IconButton, Text } from "@repo/ui/components";
import React, { useId, useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import * as css from "./sidepanelItem.css";

export interface SidepanelItemProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export function SidepanelItem({ title, children }: SidepanelItemProps) {
  const [expanded, setExpanded] = useState(true);
  const itemId = useId();

  return (
    <section className={css.container({ expanded })} aria-expanded={expanded}>
      <header className={css.header}>
        <Text type="title" size="sm">
          {title}
        </Text>
        <IconButton
          className={css.expand}
          onClick={() => setExpanded((val) => !val)}
          aria-owns={itemId}
        >
          <Icon.Custom>
            {expanded ? <MdExpandLess /> : <MdExpandMore />}
          </Icon.Custom>
        </IconButton>
      </header>
      {expanded && (
        <Flexbox id={itemId} orient="vertical" gap="lg">
          {children}
        </Flexbox>
      )}
    </section>
  );
}
