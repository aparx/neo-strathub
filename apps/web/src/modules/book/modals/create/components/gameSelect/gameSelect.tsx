import { Nullish } from "@repo/utils";

export interface GameSelectGameData {
  id: number;
  icon: string;
  name: string;
}

export interface GameSelectProps {
  games: GameSelectGameData[];
  active?: Nullish | GameSelectGameData["id"];
}

export function GameSelect({ games, active }: GameSelectProps) {}
