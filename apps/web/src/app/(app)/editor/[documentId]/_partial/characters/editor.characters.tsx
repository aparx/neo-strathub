import { Icon } from "@repo/ui/components";
import { RxQuestionMarkCircled } from "react-icons/rx";
import * as css from "./editor.characters.css";

export function EditorCharacters() {
  return (
    <ol className={css.list} aria-label={"Picked Characters"}>
      {Array.from({ length: 5 }, (_, i) => (
        <Character key={i} active={false} />
      ))}
    </ol>
  );
}

function Character({ active }: { active?: boolean }) {
  return (
    <li className={css.characterShell} aria-label={"Gadgets used"}>
      <div className={css.characterBox({ active })}>
        <RxQuestionMarkCircled size={"1em"} />
      </div>
      <ol className={css.gadgetList}>
        {Array.from({ length: 2 }, (_, i) => (
          <li key={i} className={css.gadgetBox({ active: false })}>
            <Icon.Mapped type={"add"} />
          </li>
        ))}
      </ol>
    </li>
  );
}
