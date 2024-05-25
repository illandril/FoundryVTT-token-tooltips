import calculateTileDistanceAlternating from './calculateTileDistanceAlternating';
import { SquareMeasureFrom } from './squareSettings';

const bounds = (left: number, top: number, width: number, height: number) => {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  };
};

beforeEach(() => {
  Hooks.callAll('init');
});

describe('MeasureFrom=NEAREST', () => {
  beforeEach(() => {
    SquareMeasureFrom.set('NEAREST');
  });

  it.each([
    // Grid Size 100, 1x1 tokens, same square
    [0, 100, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],

    // Grid Size 100, 1x1 tokens, horizontal distance
    [1, 100, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [2, 100, bounds(0, 0, 100, 100), bounds(200, 0, 100, 100)],
    [3, 100, bounds(0, 0, 100, 100), bounds(300, 0, 100, 100)],
    [4, 100, bounds(0, 0, 100, 100), bounds(400, 0, 100, 100)],
    [5, 100, bounds(0, 0, 100, 100), bounds(500, 0, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(600, 0, 100, 100)],
    [5, 100, bounds(100, 0, 100, 100), bounds(600, 0, 100, 100)],
    [4, 100, bounds(200, 0, 100, 100), bounds(600, 0, 100, 100)],
    [3, 100, bounds(300, 0, 100, 100), bounds(600, 0, 100, 100)],
    [2, 100, bounds(400, 0, 100, 100), bounds(600, 0, 100, 100)],
    [1, 100, bounds(500, 0, 100, 100), bounds(600, 0, 100, 100)],

    // Grid Size 100, 1x1 tokens, vertical distance
    [1, 100, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [2, 100, bounds(0, 0, 100, 100), bounds(0, 200, 100, 100)],
    [3, 100, bounds(0, 0, 100, 100), bounds(0, 300, 100, 100)],
    [4, 100, bounds(0, 0, 100, 100), bounds(0, 400, 100, 100)],
    [5, 100, bounds(0, 0, 100, 100), bounds(0, 500, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(0, 600, 100, 100)],
    [5, 100, bounds(0, 100, 100, 100), bounds(0, 600, 100, 100)],
    [4, 100, bounds(0, 200, 100, 100), bounds(0, 600, 100, 100)],
    [3, 100, bounds(0, 300, 100, 100), bounds(0, 600, 100, 100)],
    [2, 100, bounds(0, 400, 100, 100), bounds(0, 600, 100, 100)],
    [1, 100, bounds(0, 500, 100, 100), bounds(0, 600, 100, 100)],

    // Grid Size 100, 1x1 tokens, perfect diagonal distance
    [1, 100, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [3, 100, bounds(0, 0, 100, 100), bounds(200, 200, 100, 100)],
    [4, 100, bounds(0, 0, 100, 100), bounds(300, 300, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(400, 400, 100, 100)],
    [7, 100, bounds(0, 0, 100, 100), bounds(500, 500, 100, 100)],
    [9, 100, bounds(0, 0, 100, 100), bounds(600, 600, 100, 100)],
    [7, 100, bounds(100, 100, 100, 100), bounds(600, 600, 100, 100)],
    [6, 100, bounds(200, 200, 100, 100), bounds(600, 600, 100, 100)],
    [4, 100, bounds(300, 300, 100, 100), bounds(600, 600, 100, 100)],
    [3, 100, bounds(400, 400, 100, 100), bounds(600, 600, 100, 100)],
    [1, 100, bounds(500, 500, 100, 100), bounds(600, 600, 100, 100)],

    // Grid Size 100, 1x1 tokens, offset diagonal distance
    [2, 100, bounds(0, 0, 100, 100), bounds(100, 200, 100, 100)],
    [3, 100, bounds(0, 0, 100, 100), bounds(100, 300, 100, 100)],
    [4, 100, bounds(0, 0, 100, 100), bounds(100, 400, 100, 100)],
    [5, 100, bounds(0, 0, 100, 100), bounds(100, 500, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(100, 600, 100, 100)],
    [2, 100, bounds(0, 0, 100, 100), bounds(200, 100, 100, 100)],
    [3, 100, bounds(0, 0, 100, 100), bounds(300, 100, 100, 100)],
    [4, 100, bounds(0, 0, 100, 100), bounds(400, 100, 100, 100)],
    [5, 100, bounds(0, 0, 100, 100), bounds(500, 100, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(600, 100, 100, 100)],

    [4, 100, bounds(0, 0, 100, 100), bounds(200, 300, 100, 100)],
    [5, 100, bounds(0, 0, 100, 100), bounds(200, 400, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(200, 500, 100, 100)],
    [7, 100, bounds(0, 0, 100, 100), bounds(200, 600, 100, 100)],
    [8, 100, bounds(0, 0, 100, 100), bounds(200, 700, 100, 100)],

    [5, 100, bounds(0, 0, 100, 100), bounds(300, 400, 100, 100)],
    [6, 100, bounds(0, 0, 100, 100), bounds(300, 500, 100, 100)],
    [7, 100, bounds(0, 0, 100, 100), bounds(300, 600, 100, 100)],
    [8, 100, bounds(0, 0, 100, 100), bounds(300, 700, 100, 100)],
    [9, 100, bounds(0, 0, 100, 100), bounds(300, 800, 100, 100)],
  ])('returns %j for grid.size=%j, a=%j, b=%j', (expected, gridSize, a, b) => {
    const grid = {
      grid: {
        size: gridSize,
        distance: 5,
      },
    } as GridLayer;
    const token = {
      bounds: a,
      document: {
        elevation: 0,
      },
    } as Token;
    const other = {
      bounds: b,
      document: {
        elevation: 0,
      },
    } as Token;

    const resultA = calculateTileDistanceAlternating(grid, token, other);
    const resultB = calculateTileDistanceAlternating(grid, other, token);

    expect(resultA).toEqual(expected);
    expect(resultB).toEqual(expected);
  });
});
