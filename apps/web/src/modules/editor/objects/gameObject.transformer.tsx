import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { createForegroundSlotColor } from "@/app/(app)/editor/[documentId]/_partial/characters/components";
import { DefaultTransformer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Flexbox, Icon, IconButton } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import Konva from "konva";
import { forwardRef } from "react";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { HiExternalLink } from "react-icons/hi";
import { TbReplace } from "react-icons/tb";
import { useEditorEventHandler } from "../features/events";
import { GameObjectConfig } from "./gameObject";

export interface GameObjectTransformerProps {
  shown: boolean;
  link: Konva.Node | Nullish;
  config: GameObjectConfig;
}

export const GameObjectTransformer = forwardRef<
  Konva.Transformer,
  GameObjectTransformerProps
>(function GameObjectTransformer({ shown, link, config }, ref) {
  const [editor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const character = config.characterId
    ? editor.characters[config.characterId]
    : null;
  const slotColor =
    character?.player_slot?.color || vars.colors.emphasis.medium;

  return (
    <DefaultTransformer ref={ref} keepRatio link={link} shown={shown}>
      <Flexbox asChild gap="sm" style={{ marginLeft: vars.spacing.xs }}>
        <ul aria-label="Default Tools" style={{ listStyle: "none" }}>
          {config.objectType === "character" && (
            <li>
              <IconButton
                aria-label="linked"
                color={config.linkToAssignee ? "primary" : "default"}
                onClick={() =>
                  eventHandler.fire("canvasUpdate", "user", {
                    fields: {
                      [config.id]: {
                        linkToAssignee: !config.linkToAssignee,
                      },
                    },
                  })
                }
              >
                <Icon.Custom>
                  {config.linkToAssignee ? <FaLink /> : <FaLinkSlash />}
                </Icon.Custom>
              </IconButton>
            </li>
          )}
          <li>
            <IconButton
              aria-label="Duplicate"
              onClick={() =>
                eventHandler.fire("canvasDuplicate", "user", {
                  targets: [config.id],
                })
              }
            >
              <Icon.Mapped type="duplicate" />
            </IconButton>
          </li>
          <li>
            <IconButton aria-label="Copy">
              <Icon.Mapped type="copy" />
            </IconButton>
          </li>
          <li>
            <IconButton aria-label="Replace">
              <Icon.Custom>
                <TbReplace />
              </Icon.Custom>
            </IconButton>
          </li>
          <li>
            <IconButton
              color="destructive"
              aria-label="Delete"
              onClick={() =>
                eventHandler.fire("canvasDelete", "user", {
                  targets: [config.id],
                })
              }
            >
              <Icon.Mapped type="delete" />
            </IconButton>
          </li>
        </ul>
      </Flexbox>
      <div
        style={{
          background: slotColor,
          color: createForegroundSlotColor(slotColor),
          fontWeight: 700,
          height: `100%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: vars.spacing.sm,
          padding: vars.spacing.sm,
          borderRadius: vars.roundness.sm,
          border: `1px solid ${vars.colors.outline.card}`,
        }}
      >
        {character?.index != null ? 1 + character.index : "?"}
        <Icon.Custom size="sm">
          <HiExternalLink />
        </Icon.Custom>
      </div>
    </DefaultTransformer>
  );
});
