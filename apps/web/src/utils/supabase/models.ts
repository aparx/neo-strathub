import { Nullish } from "@repo/utils";

export interface PlanConfig {
  max_members: number | Nullish;
  max_books: number | Nullish;
  max_blueprints: number | Nullish;
}
