import { TeamMemberFlags } from "@/modules/auth/flags";
import { pascalCase } from "@repo/utils";
import { createSeedClient } from "@snaplet/seed";
import { LoremIpsum } from "lorem-ipsum";

type MinMaxRange = readonly [min: number, max: number];

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    min: 4,
    max: 8,
  },
  wordsPerSentence: {
    min: 2,
    max: 16,
  },
});

function generateNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function capStringLength(str: string, length: number) {
  if (str.length <= length) return str;
  return str.substring(0, length);
}

function generateUnique(context: Set<string>, generateFn: () => string) {
  let value: string;
  do {
    value = generateFn();
  } while (context.has(value));
  context.add(value);
  return value;
}

function createWordGenerator({
  range,
  maxChars,
  casing,
}: {
  range: MinMaxRange;
  maxChars?: number;
  casing?: "PascalCase";
}) {
  const [min, max] = range;
  return () => {
    let generated = lorem.generateWords(generateNumber(min, max));
    if (casing === "PascalCase") generated = pascalCase(generated);
    return maxChars ? capStringLength(generated, maxChars) : generated;
  };
}

function generateArray<T>({
  range,
  fillFn,
}: {
  range: MinMaxRange;
  fillFn: () => T;
}): T[] {
  const [min, max] = range;
  return Array.from({ length: generateNumber(min, max) }, fillFn);
}

async function main() {
  const seed = await createSeedClient({ dryRun: true });

  await seed.$resetDatabase();

  /** Generates an array of unique game names (wrapped) */
  function generateGames() {
    const nameContext = new Set<string>();
    const wordGenerator = createWordGenerator({
      range: [1, 2],
      maxChars: 20,
      casing: "PascalCase",
    });
    return generateArray({
      range: [1, 4],
      fillFn: () => ({
        name: generateUnique(nameContext, wordGenerator),
      }),
    });
  }

  /** Generates an array of unique book names (wrapped) */
  function generateBooks() {
    const wordGenerator = createWordGenerator({
      range: [1, 2],
      maxChars: 20,
      casing: "PascalCase",
    });
    const ctx = new Set<string>();
    return generateArray({
      range: [3, 10],
      fillFn: () => ({
        name: capStringLength(generateUnique(ctx, wordGenerator), 20),
      }),
    });
  }

  /** Generates an array of blueprint tags */
  function generateBlueprintTags() {
    return generateArray({
      range: [0, 10],
      fillFn: createWordGenerator({
        range: [1, 5],
        maxChars: 32,
      }),
    });
  }

  const { game } = await seed.game(generateGames);

  const { book } = await seed.plan(
    ["Essential", "Advanced", "Pro"].map((name, index) => ({
      name,
      is_default: index === 0,
      pricing: index === 0 ? 0 : undefined /* randomize */,
      team: (x) => x(3, { book: generateBooks }),
    })),
    { connect: { game } },
  );

  const { arena } = await seed.arena((x) => x(10));

  await seed.blueprint((x) => x(500, { tags: generateBlueprintTags }), {
    connect: { book, arena },
  });

  await seed.team_member_role([
    {
      name: "owner",
      flags: TeamMemberFlags.ALL,
    },
    {
      name: "editor",
      flags:
        TeamMemberFlags.VIEW_DOCUMENTS |
        TeamMemberFlags.MODIFY_DOCUMENTS |
        TeamMemberFlags.DELETE_DOCUMENTS,
    },
    {
      name: "viewer",
      flags: TeamMemberFlags.VIEW_DOCUMENTS,
    },
  ]);

  process.exit();
}

main();
