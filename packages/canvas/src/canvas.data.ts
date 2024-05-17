import { Nullish } from "@repo/utils";
import { SharedState } from "@repo/utils/hooks";
import Konva from "konva";
import Vector2d = Konva.Vector2d;

export type CanvasNodeConfig<T = Konva.NodeConfig> = T & {
  characterId?: string;
};

export type CanvasNodeData<
  TConfig extends CanvasNodeConfig = CanvasNodeConfig,
> = {
  attrs: TConfig;
  className: string;
};

type FindPredicate<T extends CanvasNodeData> = (
  node: T,
  index: number,
  level?: Nullish<CanvasLevelNode<T>>,
) => any;

type ForEachCallback<T extends CanvasNodeData> = (
  node: T,
  index: number,
  level?: Nullish<CanvasLevelNode<T>>,
) => any;

interface CanvasGroupNode<T extends CanvasNodeData> {
  find(predicate: FindPredicate<T>): T | undefined;

  forEach(callback: ForEachCallback<T>): void;
}

export class CanvasData<T extends CanvasNodeData>
  implements CanvasGroupNode<T>
{
  private readonly dataMap = new Map<string, CanvasLevelNode<T>>();

  constructor(nodes: CanvasLevelNode<T>[]) {
    nodes.forEach((node) => this.dataMap.set(node.id, node));
  }

  map<U>(callback: (node: CanvasLevelNode<T>) => U): U[] {
    const result = new Array<U>(this.dataMap.size);
    let cursor = 0;
    for (const level of this.levels()) {
      result[cursor++] = callback(level);
    }
    return result;
  }

  update(fn: (level: CanvasLevelNode<T>, previous: T[]) => any): void {
    for (const level of this.levels()) {
      this.dataMap.get(level.id)?.children.update((prev) => fn(level, prev));
    }
  }

  find(predicate: FindPredicate<T>): T | undefined {
    for (const level of this.dataMap.values()) {
      const needle = level.find((val, idx) => predicate(val, idx, level));
      if (needle != null) return needle;
    }
    return undefined;
  }

  forEach(callback: ForEachCallback<T>): void {
    for (const level of this.dataMap.values()) {
      level.forEach((val, idx) => callback(val, idx, level));
    }
  }

  getLevel(level: string): CanvasLevelNode<T> | undefined {
    return this.dataMap.get(level);
  }

  levels() {
    return this.dataMap.values();
  }

  /** Returns an array of all deep nodes (`T`) */
  deepNodes(): T[] {
    const array = new Array<T>();
    for (const [_, node] of this.dataMap) {
      array.push(...node.children.state);
    }
    return array;
  }
}

export class CanvasLevelNode<E extends CanvasNodeData = CanvasNodeData>
  implements CanvasGroupNode<E>
{
  constructor(
    public readonly id: string,
    public readonly imageUrl: string,
    public readonly position: Vector2d,
    public readonly children: SharedState<E[]>,
  ) {}

  find(predicate: (node: E, index: number) => any): E | undefined {
    return this.children.state.find(predicate);
  }

  forEach(callback: ForEachCallback<E>): void {
    this.children.state.forEach((val, idx) => callback(val, idx, this));
  }

  map<U>(mapFn: (node: E, index: number, level: this) => U): U[] {
    return this.children.state.map((val, idx) => mapFn(val, idx, this));
  }
}
