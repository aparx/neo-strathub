import { BlueprintCard } from "@/app/(app)/dashboard/@content/_components";
import * as css from "./content.body.css";

export function ContentBody() {
  return (
    <ul className={css.list} aria-label={"documents"}>
      {new Array(5).fill(
        <li>
          <BlueprintCard
            teamName={"Example Team"}
            documentName={"Lorem ipsum dolor sit amet"}
            arenaName={"Lorem ipsum dolor"}
            visibility={"public"}
            tags={new Array(6).fill("Foo Bar Baz")}
          />
        </li>,
      )}
    </ul>
  );
}
