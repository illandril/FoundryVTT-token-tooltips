import getTiles from './getTiles';

const rect = (left: number, top: number, width: number, height: number) => {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  } as PIXI.Rectangle;
};

it.each([
  [{ left: 0, right: 0, top: 0, bottom: 0 }, 100, rect(0, 0, 100, 100)],
  [{ left: 1, right: 1, top: 0, bottom: 0 }, 100, rect(100, 0, 100, 100)],
  [{ left: 0, right: 0, top: 1, bottom: 1 }, 100, rect(0, 100, 100, 100)],
  [{ left: 2, right: 3, top: 3, bottom: 3 }, 100, rect(200, 300, 200, 100)],
  [{ left: 2, right: 2, top: 3, bottom: 3 }, 100, rect(200, 300, 50, 50)],
  [{ left: 2, right: 2, top: 3, bottom: 3 }, 100, rect(250, 300, 50, 50)],
  [{ left: 2, right: 2, top: 3, bottom: 3 }, 100, rect(200, 350, 50, 50)],
  [{ left: 2, right: 2, top: 3, bottom: 3 }, 100, rect(250, 350, 50, 50)],
  [{ left: 5, right: 8, top: 16, bottom: 19 }, 100, rect(500, 1600, 400, 400)],
])('returns %j for grid.size=%j, bounds=%j', (expected, gridSize, bounds) => {
  const grid = {
    grid: {
      size: gridSize,
    },
  } as GridLayer;

  const result = getTiles(grid, bounds);

  expect(result).toEqual(expected);
});
