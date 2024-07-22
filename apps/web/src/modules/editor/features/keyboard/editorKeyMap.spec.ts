import { describe, expect, test } from "@jest/globals";
import { EditorKeyMap } from "./editorKeyMap";
import { EditorKeyTreeContract } from "./editorKeyTree";

const checkTrue = (value: any) => expect(value).toBe(true);
const checkFalse = (value: any) => expect(value).toBe(false);

describe("keyMap", () => {
  const sampleMap = {
    ctrlA: { ctrl: true, code: "A" },
    altB: { alt: true, code: "B" },
    ctrlAltC: { ctrl: true, alt: true, code: "C" },
    codeD: { code: "D" },
    metaE: { meta: true, code: "E" },
    ctrlMetaE: { ctrl: true, meta: true, code: "E" },
  } satisfies EditorKeyTreeContract;

  test("tree immutablity", () => {
    const tree = structuredClone(sampleMap);
    const keyMap = new EditorKeyMap(tree);
    // Check if the tree has been copied internally
    expect(keyMap.tree).not.toBe(tree);
    tree.ctrlA.code = "Z";
    expect(keyMap.tree.ctrlA.code).toEqual(sampleMap.ctrlA.code);
  });

  const map = new EditorKeyMap(sampleMap);

  test("isMatching", () => {
    checkTrue(map.isMatching("ctrlA", { ctrlKey: true, code: "A" }));
    checkFalse(map.isMatching("ctrlA", { ctrlKey: true, code: "a" }));
    checkFalse(map.isMatching("ctrlA", { ctrlKey: true, code: " A" }));
    checkFalse(map.isMatching("ctrlA", { ctrlKey: false, code: "a" }));
    checkFalse(map.isMatching("ctrlA", { code: "A" }));
    checkFalse(
      map.isMatching("ctrlA", { ctrlKey: true, altKey: true, code: "A" }),
    );
    checkTrue(
      map.isMatching("ctrlAltC", { ctrlKey: true, altKey: true, code: "C" }),
    );
    checkFalse(
      map.isMatching("ctrlAltC", { ctrlKey: true, altKey: true, code: "c" }),
    );
    checkFalse(
      map.isMatching("ctrlAltC", { ctrlKey: true, altKey: false, code: "C" }),
    );
    checkFalse(
      map.isMatching("ctrlAltC", { ctrlKey: false, altKey: true, code: "C" }),
    );
    checkFalse(map.isMatching("ctrlAltC", { code: "C" }));
    checkTrue(map.isMatching("metaE", { metaKey: true, code: "E" }));
    checkFalse(map.isMatching("metaE", { metaKey: true }));
    checkFalse(map.isMatching("metaE", { code: "E" }));
    checkFalse(map.isMatching("metaE", { metaKey: false, code: "E" }));
    checkFalse(map.isMatching("metaE", { metaKey: true, code: "e" }));
    checkFalse(map.isMatching("ctrlMetaE", { metaKey: true, code: "E" }));
    checkTrue(
      map.isMatching("ctrlMetaE", { ctrlKey: true, metaKey: true, code: "E" }),
    );
  });

  test("findMatching", () => {
    expect(map.findMatching({ ctrlKey: true, code: "A" })).toEqual("ctrlA");
    expect(map.findMatching({ ctrlKey: false, code: "A" })).toBeUndefined();
    expect(map.findMatching({ code: "D" })).toEqual("codeD");
    expect(map.findMatching({ metaKey: true, code: "E" })).toEqual("metaE");
    expect(
      map.findMatching({ ctrlKey: true, metaKey: true, code: "E" }),
    ).toEqual("ctrlMetaE");
  });

  test("collectMatches", () => {
    const map = new EditorKeyMap(sampleMap);
    expect(map.collectMatches({ ctrlKey: true, code: "A" })).toEqual(["ctrlA"]);
    expect(map.collectMatches({ metaKey: true, code: "E" })).toEqual(["metaE"]);
    expect(
      map.collectMatches({ metaKey: true, ctrlKey: true, code: "E" }),
    ).toEqual(["ctrlMetaE"]);
    expect(map.collectMatches({})).toEqual([]);
    expect(map.collectMatches({ code: "A" })).toEqual([]);
    expect(map.collectMatches({ code: "D" })).toEqual(["codeD"]);
  });
});
