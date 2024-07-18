import { IconButton } from "@repo/ui/components";
import { useId, useRef, useState } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import { useOnClickOutside } from "usehooks-ts";
import * as css from "./color.css";

export function Color({
  color,
  onChange,
  mode = "fill",
}: css.ColorBoxVariants &
  Readonly<{
    color: string;
    onChange: (newColor: string) => void;
  }>) {
  const [opened, setOpened] = useState(false);
  const id = useId();
  const portalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(portalRef, () => setOpened(false));

  return (
    <>
      <IconButton
        aria-controls={id}
        aria-checked={opened}
        onClick={() => setOpened((old) => !old)}
      >
        <div
          className={css.colorBox({ mode })}
          style={{
            background: mode === "fill" ? color : undefined,
            borderColor: mode === "stroke" ? color : undefined,
          }}
        />
      </IconButton>
      {opened && (
        <div ref={portalRef} id={id} className={css.container}>
          <RgbaStringColorPicker
            className={css.picker}
            color={color}
            onChange={onChange}
            style={{
              width: 150,
              height: 150,
            }}
          />
        </div>
      )}
    </>
  );
}
