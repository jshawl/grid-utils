type Grid = unknown[][];

type Predicate = (value: unknown, coli: number, rowi: number) => unknown;

type Options = {
  rows: number;
  columns?: number;
  initialize?: (col: number, row: number) => unknown;
};

export const grid = ({
  rows,
  columns = rows,
  initialize = (_) => undefined,
}: Options) => {
  return [...Array(rows)].map((row, rowi) =>
    [...Array(columns)].map((col, coli) => initialize(coli, rowi)),
  );
};

export const map = (grid: Grid, predicate: Predicate) => {
  return grid.map((row, rowi) =>
    row.map((col, coli) => {
      return predicate(col, coli, rowi);
    }),
  );
};

export const each = (grid: unknown[][], predicate: Predicate) => {
  map(grid, predicate);
  return grid;
};

export const parse = (text: string) => {
  return text
    .trim()
    .split("\n")
    .map((row) => row.split(""));
};

export const inGrid = (grid: Grid, coord: number[]) => {
  const [row, col] = coord;
  return col >= 0 && col < grid[0].length && row >= 0 && row < grid.length;
};

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export const neighbors = (grid: Grid, coord: number[]) =>
  directions.reduce((acc: number[][], el) => {
    const [col, row] = el;
    const [coordcol, coordrow] = coord;
    const neighborcol = coordcol + col;
    const neighborrow = coordrow + row;
    if (inGrid(grid, [neighborcol, neighborrow])) {
      acc.push([neighborcol, neighborrow]);
    }
    return acc;
  }, []);

type Direction = (
  grid: Grid,
  [col, row]: number[],
  all?: number[][],
) => number[][];

const direction = ([dcol, drow]: number[]) => {
  const fn: Direction = (grid, [col, row], all = []) => {
    const next = [col + dcol, row + drow];
    if (!inGrid(grid, next)) return all;
    return fn(grid, next, [...all, next]);
  };
  return fn;
};

export const top = direction([0, -1]);

export const right = direction([1, 0]);

export const bottom = direction([0, 1]);

export const left = direction([-1, 0]);

export const columns = (grid: Grid) => {
  return grid[0].map((_, coli) => grid.map((_, rowi) => grid[rowi][coli]));
};

export const find = (grid: Grid, predicate: Predicate) => {
  let coli!: number;
  let rowi!: number;
  grid.findIndex((g, i) => {
    rowi = i;
    coli = g.findIndex((element, index) => {
      return predicate(element, index, rowi);
    });
    return coli !== -1;
  });
  if (coli === -1) {
    throw new Error("Element not found");
  }
  return [coli, rowi];
};

export const subgrids = (grid: Grid, number: number) => {
  const size = Math.sqrt(number);
  if (!Number.isSafeInteger(size)) {
    throw new Error("Cannot evenly divide subgrid");
  }
  const out: unknown[][][][] = [];
  each(grid, (col, coli, rowi) => {
    const srowi = Math.floor(rowi / size);
    const scoli = Math.floor(coli / size);
    const ssrowi = rowi % size;

    out[srowi] = out[srowi] || [];
    out[srowi][scoli] = out[srowi][scoli] || [];
    out[srowi][scoli][ssrowi] = out[srowi][scoli][ssrowi] || [];
    out[srowi][scoli][ssrowi].push(col);
  });
  return out;
};
