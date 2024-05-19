import { EditorCharacter } from "@/app/(app)/editor/[documentId]/_partial/characters/components/editorCharacter";
import { DefaultBlueprintData } from "@/modules/blueprint/actions/getBlueprint";
import {
  BlueprintCharacterData,
  getBlueprintCharacters,
  getCharacterGadgetSlots,
} from "@/modules/blueprint/characters/actions";
import * as css from "./editor.characters.css";

export async function EditorCharacters({
  blueprint,
}: {
  blueprint: DefaultBlueprintData;
}) {
  // fetch all characters
  const characters = await getBlueprintCharacters(blueprint.id);

  return (
    <ol className={css.list} aria-label={"Picked Characters"}>
      {characters.map((character) => (
        // TODO Suspense Fallback?
        <Character key={character.id} {...character} />
      ))}
    </ol>
  );
}

async function Character(character: BlueprintCharacterData) {
  const slots = await getCharacterGadgetSlots(character.id);
  return <EditorCharacter data={character} slots={slots} />;
}
