import { getServiceServer } from "@/utils/supabase/actions";
import { Icon, Modal } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { ManageCharacterModal } from "./components";
import * as css from "./editor.characters.css";

async function getCharacters(blueprintId: string) {
  // TODO USE ANON SERVER INSTEAD
  const { data, error } = await getServiceServer(cookies())
    .from("blueprint_character")
    .select(
      `id, index,
       team_player_slot(id, slot_index, color), 
       game_object(id, name, url)`,
    )
    .order("index")
    .eq("blueprint_id", blueprintId);
  if (error) throw error;
  return data;
}

export type CharacterData = NonNullable<
  InferAsync<ReturnType<typeof getCharacters>>
>[number];

async function getGadgets(characterId: string) {
  // TODO USE ANON SERVER INSTEAD
  const { data, error } = await getServiceServer(cookies())
    .from("character_gadget")
    .select("id, game_object(id, name, url)")
    .eq("character_id", characterId);
  if (error) throw error;
  return data;
}

export type GadgetData = NonNullable<
  InferAsync<ReturnType<typeof getGadgets>>
>[number];

export async function EditorCharacters({
  blueprintId,
}: {
  blueprintId: string;
}) {
  // fetch all characters
  // TODO replace with anon server and RLS
  const characters = await getCharacters(blueprintId);

  return (
    <ol className={css.list} aria-label={"Picked Characters"}>
      {characters.map((character) => (
        // TODO Suspense Fallback?
        <Character key={character.id} {...character} />
      ))}
    </ol>
  );
}

async function Character(character: CharacterData) {
  const { id, game_object, team_player_slot, index } = character;
  const gadgets = await getGadgets(id);
  const active = game_object?.url != null;
  const color = team_player_slot?.color ?? "transparent";

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <li style={{ listStyle: "none" }}>
          <button
            data-character-id={id}
            className={css.characterButton}
            aria-label={"Gadgets used"}
          >
            <div
              className={css.characterBox({ active })}
              style={{ boxShadow: `inset 0 0 0 2px ${color}` }}
            >
              <RxQuestionMarkCircled size={"1em"} />
            </div>
            <ol className={css.gadgetList}>
              {gadgets.map((gadget) => (
                <GadgetSlot key={gadget.id} color={color} {...gadget} />
              ))}
            </ol>
          </button>
        </li>
      </Modal.Trigger>
      <ManageCharacterModal {...character} />
    </Modal.Root>
  );
}

function GadgetSlot({
  id,
  color,
}: GadgetData & {
  color: string;
}) {
  return (
    <li
      key={id}
      data-gadget-id={id}
      className={css.gadgetBox({ active: false })}
    >
      <Icon.Mapped type={"add"} />
    </li>
  );
}
