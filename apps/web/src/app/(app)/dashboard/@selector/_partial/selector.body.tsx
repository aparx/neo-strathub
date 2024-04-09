import { ListItem, ListItemData } from "../_components";

export function SelectorBody({ items }: { items: ListItemData[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li style={{ listStyle: "none" }}>
          <ListItem text={item.text} />
        </li>
      ))}
    </ul>
  );
}
