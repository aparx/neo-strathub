import * as css from "./template.css";

export default function Template({ children }: any) {
  return (
    <div className={css.shell}>
      <div className={css.container}>{children}</div>
    </div>
  );
}
