import { expect, test, vi } from "vitest";
import {
  grid,
  each,
  map,
  parse,
  neighbors,
  inGrid,
  top,
  right,
  bottom,
  left,
  columns,
  find,
  subgrids,
} from ".";

test("builds a square grid", () => {
  expect(grid({ rows: 2 }).flat().length).toBe(4);
});

test("builds a rectangular grid", () => {
  expect(grid({ rows: 2, columns: 3 }).flat().length).toBe(6);
});

test("initializes the grid with a value", () => {
  const random = Math.random();
  const g = grid({ rows: 2, initialize: () => random });
  expect(g.every((row) => row.every((col) => col === random))).toBe(true);
});

test("initializes the grid with a space-aware value", () => {
  const random = Math.random();
  const initialize = (col: number, row: number) => ({
    col,
    row,
    value: random,
  });
  const g = grid({ rows: 4, initialize });
  expect(g[0][0]).toEqual({ col: 0, row: 0, value: random });
  expect(g[3][1]).toEqual({ col: 1, row: 3, value: random });
});

test("each", () => {
  const g = grid({ rows: 4, initialize: () => 0 });
  const predicate = vi.fn();
  const eached = each(g, predicate);
  expect(predicate).toHaveBeenCalledTimes(16);
  expect(predicate).toHaveBeenCalledWith(0, 0, 0);
  expect(eached).toEqual(g);
});

test("map", () => {
  const g = grid({ rows: 4 });
  const random = Math.random();
  const predicate = () => random;
  const mapped = map(g, predicate);
  expect(mapped.every((r) => r.every((c) => c === random))).toBe(true);
});

test("parse", () => {
  const text = "123\n456\n789\n";
  const g = parse(text);
  expect(g[0][0]).toBe("1");
  expect(g[2][2]).toBe("9");
  expect(g.length).toBe(3);
});

test("inGrid", () => {
  const g = grid({ rows: 2 });
  expect(inGrid(g, [-1, -1])).toBe(false);
  expect(inGrid(g, [2, 2])).toBe(false);
  expect(inGrid(g, [1, 1])).toBe(true);
});

test("neighbors", () => {
  const g = parse("123\n456\n789\n");
  expect(neighbors(g, [0, 0])).toEqual([
    [1, 0],
    [0, 1],
  ]);
  expect(neighbors(g, [2, 2])).toEqual([
    [2, 1],
    [1, 2],
  ]);
});

test("top", () => {
  const g = parse("123\n456\n789\n");
  expect(top(g, [1, 1])).toEqual([[1, 0]]);
  expect(top(g, [1, 2])).toEqual([
    [1, 1],
    [1, 0],
  ]);
});

test("right", () => {
  const g = parse("123\n456\n789\n");
  expect(right(g, [0, 2])).toEqual([
    [1, 2],
    [2, 2],
  ]);
});

test("bottom", () => {
  const g = parse("123\n456\n789\n");
  expect(bottom(g, [0, 0])).toEqual([
    [0, 1],
    [0, 2],
  ]);
});

test("left", () => {
  const g = parse("123\n456\n789\n");
  expect(left(g, [2, 0])).toEqual([
    [1, 0],
    [0, 0],
  ]);
});

test("columns", () => {
  const g = parse("abc\ndef\n");
  expect(columns(g)).toEqual([
    ["a", "d"],
    ["b", "e"],
    ["c", "f"],
  ]);

  const g2 = parse("ab\ncd\nef\n");
  expect(columns(g2)).toEqual([
    ["a", "c", "e"],
    ["b", "d", "f"],
  ]);
});

test("find", () => {
  const g = parse("abc\ndef\nghi\n");
  expect(find(g, (e) => e === "a")).toEqual([0, 0]);
  expect(find(g, (e) => e === "d")).toEqual([0, 1]);
  expect(find(g, (e) => e === "i")).toEqual([2, 2]);
  expect(() => find(g, () => false)).toThrowError("Element not found");
});

test("subgrids", () => {
  const g = parse("abcd\nefgh\nijkl\nmnop\n");
  const subs = subgrids(g, 4);
  expect(subs[0][0]).toEqual([
    ["a", "b"],
    ["e", "f"],
  ]);

  expect(() => subgrids(g, 3)).toThrowError();
});
