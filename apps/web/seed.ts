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

function createSentenceGenerator({
  words,
  maxLength,
  casing,
}: {
  words: MinMaxRange;
  maxLength?: number;
  casing?: "PascalCase";
}) {
  const [min, max] = words;
  return () => {
    let generated = lorem.generateWords(generateNumber(min, max));
    if (casing === "PascalCase") generated = pascalCase(generated);
    return maxLength ? capStringLength(generated, maxLength) : generated;
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
    const nameGenerator = createSentenceGenerator({
      words: [1, 2],
      maxLength: 20,
      casing: "PascalCase",
    });
    return generateArray({
      range: [1, 4],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
      }),
    });
  }

  /** Generates an array of unique book names including an icon string */
  function generateBooks() {
    const nameContext = new Set<string>();
    const nameGenerator = createSentenceGenerator({
      words: [1, 3],
      maxLength: 20,
      casing: "PascalCase",
    });
    return generateArray({
      range: [3, 10],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
        icon: "https://svgshare.com/i/15iw.svg",
      }),
    });
  }

  /** Generates an array of blueprint tags */
  function generateBlueprintTags() {
    const nameGenerator = createSentenceGenerator({
      words: [1, 5],
      maxLength: 32,
    });
    return generateArray({
      range: [0, 10],
      fillFn: nameGenerator,
    });
  }

  const { game } = await seed.game(generateGames);

  const { book, plan } = await seed.plan(
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
    connect: { book, plan, arena },
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
