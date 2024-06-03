import { expect, test } from "@jest/globals";
import { CommandHistory } from "./commandHistory";

test("shifting", () => {
  const history = new CommandHistory<number>(3);
  history.push(1, 2, 3);
  expect(history.toArray()).toEqual([1, 2, 3]);
  expect(history.cursor()).toBe(2);
  expect(history.length()).toBe(3);
  history.push(4);
  expect(history.toArray()).toEqual([2, 3, 4]);
  expect(history.cursor()).toBe(2);
  expect(history.length()).toBe(3);
  history.push(5, 6);
  expect(history.toArray()).toEqual([4, 5, 6]);
  expect(history.cursor()).toBe(2);
  expect(history.length()).toBe(3);
  history.push(5, 6);
  expect(history.toArray()).toEqual([6, 5, 6]);
  expect(history.cursor()).toBe(2);
  expect(history.length()).toBe(3);
});

test("#toArray", () => {
  const history = new CommandHistory<number>(3);
  history.push(1, 2, 3);
  expect(history.toArray()).toEqual([1, 2, 3]);
  history.push(4);
  expect(history.toArray()).toEqual([2, 3, 4]);
});

test("#moveBack", () => {
  const history = new CommandHistory<number>(3);
  expect(history.moveBack()).toBeFalsy();
  history.push(1, 2, 3);
  expect(history.moveBack()).toBe(3);
  expect(history.moveBack()).toBe(2);
  expect(history.moveBack()).toBe(1);
  expect(history.moveBack()).toBeFalsy();
  // TODO extend
});

test("#moveForward", () => {
  const history = new CommandHistory<number>(3);
  expect(history.moveForward()).toBeFalsy();
  history.push(1, 2, 3);
  expect(history.moveForward()).toBeFalsy();
  expect(history.moveBack()).toBe(3);
  expect(history.moveForward()).toBe(3);
  expect(history.moveBack()).toBe(3);
  expect(history.moveBack()).toBe(2);
  expect(history.moveForward()).toBe(2);
  expect(history.moveForward()).toBe(3);
});
