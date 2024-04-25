import { TeamMemberFlags } from "@/modules/auth/flags";
import { pascalCase } from "@repo/utils";
import { createSeedClient } from "@snaplet/seed";
import { LoremIpsum } from "lorem-ipsum";

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

function rand(min: number, max: number) {
  return Math.ceil(Math.random() * (max - min) + min);
}

function capLength(str: string, length: number) {
  if (str.length <= length) return str;
  return str.substring(0, length);
}

function generateUnique(context: Set<string>, generatorFn: () => string) {
  let value: string;
  do {
    value = generatorFn();
  } while (context.has(value));
  context.add(value);
  return value;
}

function createWordGenerator({
  min,
  max,
  maxChars,
  casing,
}: {
  min: number;
  max: number;
  maxChars?: number;
  casing?: "pascalCase";
}) {
  return () => {
    let generated = lorem.generateWords(rand(min, max));
    if (casing === "pascalCase") generated = pascalCase(generated);
    return maxChars ? capLength(generated, maxChars) : generated;
  };
}

function generateArray<T>(min: number, max: number, fillFn: () => T): T[] {
  return Array.from({ length: rand(min, max) }, fillFn);
}

async function main() {
  const seed = await createSeedClient({ dryRun: true });

  await seed.$resetDatabase();

  const { game } = await (() => {
    const ctx = new Set<string>();
    return seed.game(
      generateArray(1, 4, () => ({
        name: generateUnique(
          ctx,
          createWordGenerator({
            min: 1,
            max: 2,
            casing: "pascalCase",
          }),
        ),
      })),
    );
  })();

  function generateBooks() {
    const ctx = new Set<string>(); // Set that ensures no duplicates
    return generateArray(3, 10, () => ({
      name: capLength(
        generateUnique(
          ctx,
          createWordGenerator({
            min: 1,
            max: 2,
            maxChars: 20,
            casing: "pascalCase",
          }),
        ),
        20,
      ),
    }));
  }

  const { book } = await seed.plan(
    [
      {
        name: "Essential",
        is_default: true,
        team: (x) => x(3, { book: generateBooks() }),
      },
      {
        name: "Advanced",
        team: (x) => x(3, { book: generateBooks() }),
      },
      {
        name: "Pro",
        team: (x) => x(3, { book: generateBooks() }),
      },
    ],
    {
      connect: { game },
    },
  );

  const { arena } = await seed.arena((x) => x(10));

  await seed.blueprint(
    (x) =>
      x(500, {
        tags: () =>
          generateArray(
            0,
            10,
            createWordGenerator({
              min: 1,
              max: 5,
              maxChars: 32,
            }),
          ),
      }),
    { connect: { book, arena } },
  );

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
