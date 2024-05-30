import Konva from "konva";
import { SetStateAction } from "react";
import { CanvasNode } from "./node";

export interface CanvasNodeState<TNode extends CanvasNode> {
  record(): Record<number, TNode[]>;
  update(value: SetStateAction<Record<number, TNode[]>>): void;
}

export interface CanvasLevelBaseData {
  readonly id: number;
  readonly position: Readonly<Konva.Vector2d>;
  readonly imageURL: string;
}

export class CanvasData<TNode extends CanvasNode = any>
  implements Iterable<CanvasLevelData<TNode>>
{
  private readonly dataMap = new Map<number, CanvasLevelData<TNode>>();

  constructor(
    public readonly state: CanvasNodeState<TNode>,
    levels: CanvasLevelData<TNode>[],
  ) {
    levels.map((level) => this.dataMap.set(level.data.id, level));
  }

  level(id: number) {
    return this.dataMap.get(id);
  }

  levels(): CanvasLevelData<TNode>[] {
    const iterator = this[Symbol.iterator]();
    return Array.from({ length: this.dataMap.size }, () => {
      const nextValue = iterator.next().value;
      if (!(nextValue instanceof CanvasLevelData))
        throw new Error("Type Error: Level is not a level");
      return nextValue;
    });
  }

  [Symbol.iterator](): Iterator<CanvasLevelData<TNode>> {
    return this.dataMap.values();
  }
}

export class CanvasLevelData<TNode extends CanvasNode = CanvasNode>
  implements Iterable<TNode>
{
  constructor(
    readonly root: CanvasData<TNode>,
    readonly data: CanvasLevelBaseData,
  ) {}

  children(): TNode[] | undefined {
    return this.root.state.record()[this.data.id];
  }

  update(value: SetStateAction<TNode[]>) {
    return this.root.state.update((oldRecord) => {
      const newRecord = { ...oldRecord };
      newRecord[this.data.id] =
        typeof value === "function"
          ? value(newRecord[this.data.id] ?? [])
          : value;
      return newRecord;
    });
  }

  [Symbol.iterator](): Iterator<TNode> {
    return (this.children() ?? [])[Symbol.iterator]();
  }
}
