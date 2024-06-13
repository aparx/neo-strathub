import { TeamMemberFlags } from "@/modules/auth/flags";
import { PlanConfig } from "@/utils/supabase/models";
import { pascalCase } from "@repo/utils";
import {
  arenaChildInputs,
  bookChildInputs,
  createSeedClient,
  gameChildInputs,
  teamChildInputs,
} from "@snaplet/seed";
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

  const generateGameObjects = (url: string, type: string) => {
    const nameContext = new Set<string>();
    const nameGenerator = createSentenceGenerator({
      words: [1, 3],
      maxLength: 32,
    });

    return generateArray({
      range: [30, 50],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
        url,
        type,
      }),
    });
  };

  /** Generates an array of unique game names (wrapped) */
  const generateGames: gameChildInputs = () => {
    const nameContext = new Set<string>();
    const nameGenerator = createSentenceGenerator({
      words: [1, 2],
      maxLength: 20,
      casing: "PascalCase",
    });
    return generateArray({
      range: [3, 6],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
        icon: "https://svgshare.com/i/15iw.svg",
        metadata: { player_count: 5, gadgets_per_character: 2 },
        hidden: false,
        game_object: () => [
          ...generateGameObjects(
            "https://svgshare.com/i/16EY.svg",
            "character",
          ),
          ...generateGameObjects("https://svgshare.com/i/16EY.svg", "gadget"),
        ],
      }),
    });
  };

  /** Generates an array of unique book names including an icon string */
  const generateBooks: bookChildInputs = () => {
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
      }),
    });
  };

  const generateTeams: teamChildInputs = () => {
    const nameContext = new Set<string>();
    const nameGenerator = createSentenceGenerator({
      words: [2, 4],
      maxLength: 20,
      casing: "PascalCase",
    });

    return generateArray({
      range: [2, 2],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
        book: generateBooks,
      }),
    });
  };

  const generateArenas: arenaChildInputs = () => {
    const nameContext = new Set<string>();
    const nameGenerator = createSentenceGenerator({
      words: [2, 3],
      maxLength: 20,
      casing: "PascalCase",
    });

    return generateArray({
      range: [5, 8],
      fillFn: () => ({
        name: generateUnique(nameContext, nameGenerator),
        arena_level: () => [
          {
            image: "https://svgshare.com/i/161z.svg",
            index: 0,
          },
          {
            image: "https://svgshare.com/i/162B.svg",
            index: 1,
          },
          {
            image: "https://svgshare.com/i/1602.svg",
            index: 2,
          },
        ],
      }),
    });
  };

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
      default_plan: index === 0,
      pricing: index === 0 ? 0 : undefined /* randomize */,
      team: generateTeams,
      color: [
        "rgba(245, 245, 245, .7)",
        "rgb(107, 185, 242)",
        "rgb(224, 76, 85)",
      ][index]!,
      config: {
        max_members: (1 + index) * 6,
        max_blueprints: (1 + index) * 100,
        max_books: (1 + index) * 20,
      } satisfies PlanConfig,
    })),
    { connect: { game } },
  );

  const { arena, arena_level } = await seed.arena(generateArenas, {
    connect: { game },
  });

  await seed.blueprint(
    (x) =>
      x(500, {
        tags: generateBlueprintTags,
        blueprint_stage: () => [{ index: 0 }, { index: 1 }, { index: 2 }],
      }),
    {
      connect: { book, plan, game, arena, arena_level },
    },
  );

  await seed.member_role([
    {
      name: "owner",
      flags: TeamMemberFlags.ALL,
    },
    {
      name: "editor",
      flags:
        TeamMemberFlags.VIEW_DOCUMENTS |
        TeamMemberFlags.MODIFY_DOCUMENTS |
        TeamMemberFlags.EDIT_MEMBERS |
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
