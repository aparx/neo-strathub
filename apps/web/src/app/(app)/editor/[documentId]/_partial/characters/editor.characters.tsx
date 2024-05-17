import { getServiceServer } from "@/utils/supabase/actions";
import { Icon } from "@repo/ui/components";
import { InferAsync } from "@repo/utils";
import { cookies } from "next/headers";
import { RxQuestionMarkCircled } from "react-icons/rx";
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

type CharacterData = NonNullable<
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

type GadgetData = NonNullable<
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

async function Character({ id, game_object }: CharacterData) {
  const gadgets = await getGadgets(id);
  const active = game_object?.url != null;

  return (
    <li
      data-character-id={id}
      className={css.characterShell}
      aria-label={"Gadgets used"}
    >
      <div className={css.characterBox({ active })}>
        <RxQuestionMarkCircled size={"1em"} />
      </div>
      <ol className={css.gadgetList}>
        {gadgets.map((gadget) => (
          <GadgetSlot key={gadget.id} {...gadget} />
        ))}
      </ol>
    </li>
  );
}

function GadgetSlot({ id }: GadgetData) {
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
