import calculateTileOffset from './calculateTileOffset';
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
    // Grid Size 100, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 100, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 100, 1/2x1/2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(0, 100, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],

    // Grid Size 50, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(0, 100, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(200, 400, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(300, 400, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(200, 500, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(300, 500, 50, 50)],
    [{ elevation: 0, horizontal: 6, vertical: 6 }, 50, bounds(-100, -200, 50, 50), bounds(200, 100, 50, 50)],

    // Grid Size 50, 2x2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 5, vertical: 5 }, 50, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 50, 1x2 and 2x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(50, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(50, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(50, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 50, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(50, 100, 50, 100), bounds(100, 50, 100, 50)],

    // Grid Size 50, 3x3 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(0, 0, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(-100, 100, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(150, 150, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(150, 0, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(150, 50, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(150, -50, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(0, 150, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(-50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(100, 150, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(-100, 150, 150, 150)],

    // Grid Size 50, 4x4 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(0, 0, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(150, -150, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(-150, 150, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(200, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(0, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(50, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(100, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(150, 200, 200, 200)],
    [{ elevation: 0, horizontal: 2, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(250, 200, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 0, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 50, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 100, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 150, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 2 }, 50, bounds(0, 0, 200, 200), bounds(200, 250, 200, 200)],
  ])('returns %j for grid.size=%j, a=%j, b=%j', (expected, gridSize, a, b) => {
    const grid = {
      size: gridSize,
      grid: {
        options: {
          dimensions: {
            distance: 5,
          },
        },
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

    const resultA = calculateTileOffset(grid, token, other);
    const resultB = calculateTileOffset(grid, other, token);

    expect(resultA).toEqual(expected);
    expect(resultB).toEqual(expected);
  });
});

describe('MeasureFrom=CENTER_NEAR', () => {
  beforeEach(() => {
    SquareMeasureFrom.set('CENTER_NEAR');
  });

  it.each([
    // Grid Size 100, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 100, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 100, 1/2x1/2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(0, 100, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],

    // Grid Size 50, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(0, 100, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(200, 400, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(300, 400, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(200, 500, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(300, 500, 50, 50)],
    [{ elevation: 0, horizontal: 6, vertical: 6 }, 50, bounds(-100, -200, 50, 50), bounds(200, 100, 50, 50)],

    // Grid Size 50, 2x2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 5, vertical: 5 }, 50, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 50, 1x2 and 2x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(50, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(50, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 50, bounds(0, 0, 50, 100), bounds(50, 0, 100, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 50, bounds(0, 50, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(50, 100, 50, 100), bounds(100, 50, 100, 50)],

    // Grid Size 50, 3x3 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(0, 0, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 150, 150), bounds(-100, 100, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(150, 150, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(150, 0, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(150, 50, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(150, -50, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(0, 150, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(-50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(100, 150, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(-100, 150, 150, 150)],

    // Grid Size 50, 4x4 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(0, 0, 200, 200)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 200, 200), bounds(150, -150, 200, 200)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 200, 200), bounds(-150, 150, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(200, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(0, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(50, 200, 200, 200)],
    [{ elevation: 0, horizontal: 1, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(100, 200, 200, 200)],
    [{ elevation: 0, horizontal: 2, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(150, 200, 200, 200)],
    [{ elevation: 0, horizontal: 4, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(250, 200, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 0, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 50, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 1 }, 50, bounds(0, 0, 200, 200), bounds(200, 100, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 2 }, 50, bounds(0, 0, 200, 200), bounds(200, 150, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 4 }, 50, bounds(0, 0, 200, 200), bounds(200, 250, 200, 200)],
  ])('returns %j for grid.size=%j, a=%j, b=%j', (expected, gridSize, a, b) => {
    const grid = {
      size: gridSize,
      grid: {
        options: {
          dimensions: {
            distance: 5,
          },
        },
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

    const resultA = calculateTileOffset(grid, token, other);
    const resultB = calculateTileOffset(grid, other, token);

    expect(resultA).toEqual(expected);
    expect(resultB).toEqual(expected);
  });
});

describe('MeasureFrom=CENTER_FAR', () => {
  beforeEach(() => {
    SquareMeasureFrom.set('CENTER_FAR');
  });

  it.each([
    // Grid Size 100, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 100, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 100, 1/2x1/2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 0 }, 100, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(0, 100, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 100, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],

    // Grid Size 50, 1x1 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(0, 0, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(0, 0, 50, 50), bounds(100, 0, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(0, 100, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 50, 50), bounds(100, 100, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(200, 400, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 0 }, 50, bounds(200, 400, 50, 50), bounds(300, 400, 50, 50)],
    [{ elevation: 0, horizontal: 0, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(200, 500, 50, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(200, 400, 50, 50), bounds(300, 500, 50, 50)],
    [{ elevation: 0, horizontal: 6, vertical: 6 }, 50, bounds(-100, -200, 50, 50), bounds(200, 100, 50, 50)],

    // Grid Size 50, 2x2 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(0, 0, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(0, 0, 100, 100), bounds(100, 0, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(0, 0, 100, 100), bounds(0, 100, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 50, bounds(0, 0, 100, 100), bounds(100, 100, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(200, 400, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(200, 400, 100, 100), bounds(300, 400, 100, 100)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(200, 400, 100, 100), bounds(200, 500, 100, 100)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 50, bounds(200, 400, 100, 100), bounds(300, 500, 100, 100)],
    [{ elevation: 0, horizontal: 7, vertical: 7 }, 50, bounds(-100, -200, 100, 100), bounds(200, 100, 100, 100)],

    // Grid Size 50, 1x2 and 2x1 tokens
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(0, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(50, 0, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 1 }, 50, bounds(50, 0, 50, 100), bounds(0, 50, 100, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 1 }, 50, bounds(0, 0, 50, 100), bounds(50, 0, 100, 50)],
    [{ elevation: 0, horizontal: 1, vertical: 2 }, 50, bounds(0, 50, 50, 100), bounds(0, 0, 100, 50)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(50, 100, 50, 100), bounds(100, 50, 100, 50)],

    // Grid Size 50, 3x3 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(0, 0, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 2 }, 50, bounds(0, 0, 150, 150), bounds(-100, 100, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(150, 150, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 0 }, 50, bounds(0, 0, 150, 150), bounds(150, 0, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(150, 50, 150, 150)],
    [{ elevation: 0, horizontal: 3, vertical: 1 }, 50, bounds(0, 0, 150, 150), bounds(150, -50, 150, 150)],
    [{ elevation: 0, horizontal: 0, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(0, 150, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 1, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(-50, 150, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(100, 150, 150, 150)],
    [{ elevation: 0, horizontal: 2, vertical: 3 }, 50, bounds(0, 0, 150, 150), bounds(-100, 150, 150, 150)],

    // Grid Size 50, 4x4 tokens
    [{ elevation: 0, horizontal: 0, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(0, 0, 200, 200)],
    [{ elevation: 0, horizontal: 4, vertical: 4 }, 50, bounds(0, 0, 200, 200), bounds(150, -150, 200, 200)],
    [{ elevation: 0, horizontal: 4, vertical: 4 }, 50, bounds(0, 0, 200, 200), bounds(-150, 150, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(200, 200, 200, 200)],
    [{ elevation: 0, horizontal: 0, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(0, 200, 200, 200)],
    [{ elevation: 0, horizontal: 2, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(50, 200, 200, 200)],
    [{ elevation: 0, horizontal: 3, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(100, 200, 200, 200)],
    [{ elevation: 0, horizontal: 4, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(150, 200, 200, 200)],
    [{ elevation: 0, horizontal: 6, vertical: 5 }, 50, bounds(0, 0, 200, 200), bounds(250, 200, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 0 }, 50, bounds(0, 0, 200, 200), bounds(200, 0, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 2 }, 50, bounds(0, 0, 200, 200), bounds(200, 50, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 3 }, 50, bounds(0, 0, 200, 200), bounds(200, 100, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 4 }, 50, bounds(0, 0, 200, 200), bounds(200, 150, 200, 200)],
    [{ elevation: 0, horizontal: 5, vertical: 6 }, 50, bounds(0, 0, 200, 200), bounds(200, 250, 200, 200)],
  ])('returns %j for grid.size=%j, a=%j, b=%j', (expected, gridSize, a, b) => {
    const grid = {
      size: gridSize,
      grid: {
        options: {
          dimensions: {
            distance: 5,
          },
        },
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

    const resultA = calculateTileOffset(grid, token, other);
    const resultB = calculateTileOffset(grid, other, token);

    expect(resultA).toEqual(expected);
    expect(resultB).toEqual(expected);
  });
});
