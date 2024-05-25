import calculateDistanceWithUnits from './calculateDistanceWithUnits';
import { GridlessIncludeElevation } from './gridless/gridlessSettings';
import { HexDistanceChoice, HexIncludeElevation } from './hex/hexSettings';
import { SquareDistanceChoice, SquareIncludeElevation, SquareMeasureFrom } from './square/squareSettings';

beforeAll(() => {
  Hooks.callAll('init');
});

const mockTokenCenter = ({
  x,
  y,
  elevation,
}: {
  x: number;
  y: number;
  elevation: number;
}) => {
  return {
    center: {
      x,
      y,
    },
    document: {
      elevation,
    } as Partial<TokenDocument>,
  } as Partial<Token> as Token;
};
const mockTokenBounds = ({
  left,
  right,
  top,
  bottom,
  elevation,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
  elevation: number;
}) => {
  return {
    bounds: {
      left,
      right,
      top,
      bottom,
    },
    document: {
      elevation,
    } as Partial<TokenDocument>,
  } as Partial<Token> as Token;
};

const scene = {
  grid: {
    units: 'mock-units',
  },
} as Partial<Scene> as Scene;

const gridNoType = {
  grid: {
    size: 100,
    distance: 5,
    type: foundry.CONST.GRID_TYPES.GRIDLESS,
  } as foundry.grid.BaseGrid,
  measureDistance: () => -42,
} as Partial<GridLayer>;

describe('Gridless', () => {
  const grid = {
    ...gridNoType,
    grid: {
      ...gridNoType.grid,
      type: foundry.CONST.GRID_TYPES.GRIDLESS,
    },
  } as GridLayer;

  describe('w/ Elevation', () => {
    beforeEach(() => {
      GridlessIncludeElevation.set(true);
    });

    it.each([
      // Straight lines
      ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
      ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 0 }],
      ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 0 }],
      ['5', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
      ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
      ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
      ['10', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 0 }],
      ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],

      // Integer triangles
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: 20 }],
      ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
      ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
      ['25', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
      ['25', { x: 0, y: -400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 300, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 0, elevation: 15 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 15 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: 20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: 20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: -400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: -20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: -20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: -20 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: -20 }],
      ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 0 }],
      ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 0 }],
      ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 0 }],
      ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 0 }],
      ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],

      // Integer pyramids
      ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 60 }],
      ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 1200, elevation: 20 }],
      ['65', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 400, elevation: 15 }],
      ['65', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 60 }],
      ['65', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 60 }],
      ['65', { x: 0, y: 0, elevation: 60 }, { x: 300, y: 400, elevation: 0 }],
      ['125', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 100 }],
      ['125', { x: 900, y: 0, elevation: 100 }, { x: 0, y: 1200, elevation: 0 }],
      ['125', { x: -300, y: 2000, elevation: 75 }, { x: 600, y: 3200, elevation: 175 }],

      // Non-integer results
      ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
      ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 0 }],
      ['183.22', { x: 5600, y: 200, elevation: 30 }, { x: 8900, y: 1200, elevation: 92 }],
      ['438.49', { x: -1500, y: 5000, elevation: -125 }, { x: 6000, y: 1500, elevation: 20 }],
    ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
      const expected = {
        units: 'mock-units',
        value: expectedValue,
      };
      const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
      const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
      expect(resultA).toEqual(expected);
      expect(resultB).toEqual(expected);
    });
  });

  describe('w/o Elevation', () => {
    beforeEach(() => {
      GridlessIncludeElevation.set(false);
    });

    it.each([
      // Straight lines
      ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
      ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 20 }],
      ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 20 }],
      ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
      ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
      ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
      ['0', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 20 }],
      ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 50 }],

      // Integer triangles
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 10 }],
      ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 20 }],
      ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 30 }],
      ['25', { x: 0, y: 400, elevation: 10 }, { x: 300, y: 0, elevation: 0 }],
      ['25', { x: 0, y: -400, elevation: 20 }, { x: 300, y: 0, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 30 }, { x: 400, y: 300, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 50 }, { x: -300, y: 400, elevation: 100 }],
      ['25', { x: 0, y: 0, elevation: -20 }, { x: 300, y: -400, elevation: 0 }],
      ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 25 }],
      ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 25 }],
      ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 25 }],
      ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 25 }],
      ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 25 }],
      ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],
      ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 25 }],

      // Non-integer results
      ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
      ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 25 }],
      ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 100 }],
    ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
      const expected = {
        units: 'mock-units',
        value: expectedValue,
      };
      const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
      const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
      expect(resultA).toEqual(expected);
      expect(resultB).toEqual(expected);
    });
  });
});

describe('Square', () => {
  const grid = {
    ...gridNoType,
    grid: {
      ...gridNoType.grid,
      type: foundry.CONST.GRID_TYPES.SQUARE,
    },
  } as GridLayer;

  describe('Grid', () => {
    beforeEach(() => {
      SquareDistanceChoice.set('GRID');
    });

    describe.each([true, false])('IncludeElevation=%j', (includeElevation) => {
      // biome-ignore lint/suspicious/noDuplicateTestHooks: Not sure why this gets flagged - not duplicate
      beforeEach(() => {
        SquareIncludeElevation.set(includeElevation);
      });

      describe('MeasureFrom=CENTER_NEAR', () => {
        beforeEach(() => {
          SquareMeasureFrom.set('CENTER_NEAR');
        });
        it.each([
          // 1x1
          [
            { x: 0, y: 0 },
            { left: 0, right: 100, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 0 },
            { left: 100, right: 200, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 0, y: 100 },
            { left: 0, right: 100, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 100 },
            { left: 100, right: 200, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],

          // 2x2
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 200 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 100, bottom: 300 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 100 },
            { left: 0, right: 200, top: 200, bottom: 400 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 200, y: 0 },
            { left: 300, right: 500, top: 0, bottom: 200 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 300, y: 200 },
            { left: 400, right: 600, top: -300, bottom: -100 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],

          // 3x3
          [
            { x: 0, y: 0 },
            { left: 0, right: 300, top: 0, bottom: 300 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],
          [
            { x: 200, y: 200 },
            { left: -200, right: 100, top: 200, bottom: 500 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],
          [
            { x: 0, y: 300 },
            { left: 0, right: 300, top: 300, bottom: 600 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],
          [
            { x: 300, y: 200 },
            { left: 300, right: 600, top: 200, bottom: 500 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],

          // 1/2x1/2
          [
            { x: 0, y: 0 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 0, right: 50, top: 0, bottom: 50 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 50, right: 100, top: 0, bottom: 50 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 0, right: 50, top: 50, bottom: 100 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 50, right: 100, top: 50, bottom: 100 },
          ],
          [
            { x: 200, y: 300 },
            { left: 50, right: 100, top: 50, bottom: 100 },
            { left: 200, right: 250, top: 300, bottom: 350 },
          ],
          [
            { x: 200, y: 300 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 200, right: 250, top: 300, bottom: 350 },
          ],
          [
            { x: 200, y: 300 },
            { left: 0, right: 50, top: 0, bottom: 50 },
            { left: 250, right: 300, top: 350, bottom: 400 },
          ],

          // 2x2 and 1x1
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 200 },
            { left: 100, right: 200, top: 100, bottom: 200 },
          ],
          [
            { x: 100, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 200 },
            { left: 200, right: 300, top: 100, bottom: 200 },
          ],
          [
            { x: 0, y: 300 },
            { left: 0, right: 200, top: 0, bottom: 200 },
            { left: 100, right: 200, top: -300, bottom: -200 },
          ],

          // 2x1 and 1x2
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 100 },
            { left: 100, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 100, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 100 },
            { left: 200, right: 300, top: 0, bottom: 200 },
          ],
          [
            { x: 100, y: 0 },
            { left: 0, right: 200, top: 0, bottom: 100 },
            { left: 200, right: 300, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 300 },
            { left: 0, right: 200, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 300, bottom: 500 },
          ],
        ])('passes ({x: 0, y: 0}, %j, _) for bounds (%j, %j) to grid.measureDistance', (position, boundsA, boundsB) => {
          const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsA, elevation: 10 }),
            mockTokenBounds({ ...boundsB, elevation: 40 }),
          );
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsB, elevation: 10 }),
            mockTokenBounds({ ...boundsA, elevation: 40 }),
          );
          expect(measureDistance).toHaveBeenNthCalledWith(1, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toHaveBeenNthCalledWith(2, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toBeCalledTimes(2);
        });
      });

      describe('MeasureFrom=CENTER_FAR', () => {
        beforeEach(() => {
          SquareMeasureFrom.set('CENTER_FAR');
        });
        it.each([
          [
            { x: 0, y: 0 },
            { left: 0, right: 100, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 0 },
            { left: 100, right: 200, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 0, y: 100 },
            { left: 0, right: 100, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 100 },
            { left: 100, right: 200, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 300, y: 0 },
            { left: 200, right: 400, top: 0, bottom: 200 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 300, y: 200 },
            { left: 200, right: 400, top: 100, bottom: 300 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 300, y: 200 },
            { left: 200, right: 400, top: 100, bottom: 300 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 400, y: 400 },
            { left: 300, right: 500, top: 300, bottom: 500 },
            { left: 0, right: 200, top: 0, bottom: 200 },
          ],
          [
            { x: 0, y: 200 },
            { left: 100, right: 200, top: 300, bottom: 400 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],
          [
            { x: 200, y: 0 },
            { left: 300, right: 400, top: 100, bottom: 200 },
            { left: 0, right: 300, top: 0, bottom: 300 },
          ],
        ])('passes ({x: 0, y: 0}, %j, _) for bounds (%j, %j) to grid.measureDistance', (position, boundsA, boundsB) => {
          const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsA, elevation: 10 }),
            mockTokenBounds({ ...boundsB, elevation: 40 }),
          );
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsB, elevation: 10 }),
            mockTokenBounds({ ...boundsA, elevation: 40 }),
          );
          expect(measureDistance).toHaveBeenNthCalledWith(1, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toHaveBeenNthCalledWith(2, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toBeCalledTimes(2);
        });
      });

      describe('MeasureFrom=NEAREST', () => {
        beforeEach(() => {
          SquareMeasureFrom.set('NEAREST');
        });
        it.each([
          [
            { x: 0, y: 0 },
            { left: 0, right: 100, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 0 },
            { left: 100, right: 200, top: 0, bottom: 100 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 0, y: 100 },
            { left: 0, right: 100, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
          [
            { x: 100, y: 100 },
            { left: 100, right: 200, top: 100, bottom: 200 },
            { left: 0, right: 100, top: 0, bottom: 100 },
          ],
        ])('passes ({x: 0, y: 0}, %j, _) for bounds (%j, %j) to grid.measureDistance', (position, boundsA, boundsB) => {
          const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsA, elevation: 10 }),
            mockTokenBounds({ ...boundsB, elevation: 40 }),
          );
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ ...boundsB, elevation: 10 }),
            mockTokenBounds({ ...boundsA, elevation: 40 }),
          );
          expect(measureDistance).toHaveBeenNthCalledWith(1, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toHaveBeenNthCalledWith(2, { x: 0, y: 0 }, position, expect.anything());
          expect(measureDistance).toBeCalledTimes(2);
        });
      });

      describe.each(['CENTER_FAR', 'CENTER_NEAR', 'NEAREST'] as const)('MeasureFrom=%s', (measureFrom) => {
        // biome-ignore lint/suspicious/noDuplicateTestHooks: Not sure why this gets flagged - not duplicate
        beforeEach(() => {
          SquareMeasureFrom.set(measureFrom);
        });

        it('passes gridSpaces=true to grid.measureDistance(_, _, x)', () => {
          const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
          calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ left: 0, right: 100, top: 0, bottom: 100, elevation: 10 }),
            mockTokenBounds({ left: 0, right: 100, top: 0, bottom: 100, elevation: 40 }),
          );
          expect(measureDistance).toBeCalledWith(expect.anything(), expect.anything(), { gridSpaces: true });
          expect(measureDistance).toBeCalledTimes(1);
        });

        it.each([
          [5, '5'],
          [10, '10'],
          [27, '27'],
          [1.23456, '1.23'],
        ])('returns results (%j -> %j) from grid.measureDistance', (measureDistanceReturn, expected) => {
          jest.spyOn(grid, 'measureDistance').mockReturnValue(measureDistanceReturn);
          const result = calculateDistanceWithUnits(
            scene,
            grid,
            mockTokenBounds({ left: 0, right: 100, top: 0, bottom: 100, elevation: 10 }),
            mockTokenBounds({ left: 0, right: 100, top: 0, bottom: 100, elevation: 40 }),
          );
          expect(result).toEqual({
            value: expected,
            units: 'mock-units',
          });
        });
      });
    });
  });

  describe.each(['CENTER_NEAR', 'CENTER_FAR'] as const)('Euclidian (%s)', (measureFrom) => {
    beforeEach(() => {
      SquareDistanceChoice.set('EUCLIDIAN');
      SquareMeasureFrom.set(measureFrom);
    });

    describe('w/ Elevation', () => {
      beforeEach(() => {
        SquareIncludeElevation.set(true);
      });

      it.each([
        // Straight lines
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 0 }],
        ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
        ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['10', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 0 }],
        ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],

        // Integer triangles
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: 20 }],
        ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
        ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: -400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 300, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 0, elevation: 15 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 15 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: -20 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 0 }],
        ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 0 }],
        ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 0 }],
        ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 0 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],

        // Integer pyramids
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 60 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 1200, elevation: 20 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 400, elevation: 15 }],
        ['65', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 60 }],
        ['65', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 60 }],
        ['65', { x: 0, y: 0, elevation: 60 }, { x: 300, y: 400, elevation: 0 }],
        ['125', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 100 }],
        ['125', { x: 900, y: 0, elevation: 100 }, { x: 0, y: 1200, elevation: 0 }],
        ['125', { x: -300, y: 2000, elevation: 75 }, { x: 600, y: 3200, elevation: 175 }],

        // Non-integer results
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
        ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 0 }],
        ['183.22', { x: 5600, y: 200, elevation: 30 }, { x: 8900, y: 1200, elevation: 92 }],
        ['438.49', { x: -1500, y: 5000, elevation: -125 }, { x: 6000, y: 1500, elevation: 20 }],
      ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
        const expected = {
          units: 'mock-units',
          value: expectedValue,
        };
        const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
        const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
        expect(resultA).toEqual(expected);
        expect(resultB).toEqual(expected);
      });
    });

    describe('w/o Elevation', () => {
      beforeEach(() => {
        SquareIncludeElevation.set(false);
      });

      it.each([
        // Straight lines
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 20 }],
        ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 20 }],
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
        ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
        ['0', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 20 }],
        ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 50 }],

        // Integer triangles
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 10 }],
        ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 20 }],
        ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 30 }],
        ['25', { x: 0, y: 400, elevation: 10 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: -400, elevation: 20 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 30 }, { x: 400, y: 300, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 50 }, { x: -300, y: 400, elevation: 100 }],
        ['25', { x: 0, y: 0, elevation: -20 }, { x: 300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 25 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 25 }],
        ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 25 }],
        ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 25 }],
        ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 25 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 25 }],

        // Non-integer results
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 25 }],
        ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 100 }],
      ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
        const expected = {
          units: 'mock-units',
          value: expectedValue,
        };
        const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
        const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
        expect(resultA).toEqual(expected);
        expect(resultB).toEqual(expected);
      });
    });
  });

  it.todo('Euclidian (NEAREST)');

  it.todo('Alternating (NEAREST)');
  it.todo('Alternating (CENTER_NEAR)');
  it.todo('Alternating (CENTER_FAR)');

  it.todo('Equidistant (NEAREST)');
  it.todo('Equidistant (CENTER_NEAR)');
  it.todo('Equidistant (CENTER_FAR)');
});

describe.each([
  foundry.CONST.GRID_TYPES.HEXEVENQ,
  foundry.CONST.GRID_TYPES.HEXEVENR,
  foundry.CONST.GRID_TYPES.HEXODDQ,
  foundry.CONST.GRID_TYPES.HEXODDR,
])('Hex (%j)', (gridType) => {
  const grid = {
    ...gridNoType,
    grid: {
      ...gridNoType.grid,
      type: gridType,
    },
  } as GridLayer;

  describe('Grid', () => {
    beforeEach(() => {
      HexDistanceChoice.set('GRID');
    });

    describe.each([true, false])('IncludeElevation=%j', (includeElevation) => {
      // biome-ignore lint/suspicious/noDuplicateTestHooks: Not sure why this gets flagged... not duplicate
      beforeEach(() => {
        HexIncludeElevation.set(includeElevation);
      });

      it.each([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 20 },
        { x: -52, y: 350 },
      ])('passes token position (%j) to grid.measureDistance(x, _, _)', (position) => {
        const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
        calculateDistanceWithUnits(
          scene,
          grid,
          mockTokenCenter({ ...position, elevation: 10 }),
          mockTokenCenter({ x: 0, y: 0, elevation: 40 }),
        );
        expect(measureDistance).toBeCalledWith(position, expect.anything(), expect.anything());
        expect(measureDistance).toBeCalledTimes(1);
      });

      it.each([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 0, y: 20 },
        { x: -52, y: 350 },
      ])('passes other position (%j) to grid.measureDistance(_, x, _)', (position) => {
        const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
        calculateDistanceWithUnits(
          scene,
          grid,
          mockTokenCenter({ x: 0, y: 0, elevation: 40 }),
          mockTokenCenter({ ...position, elevation: 10 }),
        );
        expect(measureDistance).toBeCalledWith(expect.anything(), position, expect.anything());
        expect(measureDistance).toBeCalledTimes(1);
      });

      it('passes gridSpaces=true to grid.measureDistance(_, _, x)', () => {
        const measureDistance = jest.spyOn(grid, 'measureDistance').mockReturnValue(5);
        calculateDistanceWithUnits(
          scene,
          grid,
          mockTokenCenter({ x: 0, y: 0, elevation: 40 }),
          mockTokenCenter({ x: 0, y: 0, elevation: 40 }),
        );
        expect(measureDistance).toBeCalledWith(expect.anything(), expect.anything(), { gridSpaces: true });
        expect(measureDistance).toBeCalledTimes(1);
      });

      it.each([
        [5, '5'],
        [10, '10'],
        [27, '27'],
        [1.23456, '1.23'],
      ])('returns results (%j -> %j) from grid.measureDistance', (measureDistanceReturn, expected) => {
        jest.spyOn(grid, 'measureDistance').mockReturnValue(measureDistanceReturn);
        const result = calculateDistanceWithUnits(
          scene,
          grid,
          mockTokenCenter({ x: 0, y: 0, elevation: 10 }),
          mockTokenCenter({ x: 0, y: 0, elevation: 40 }),
        );
        expect(result).toEqual({
          value: expected,
          units: 'mock-units',
        });
      });
    });
  });

  describe('Euclidian', () => {
    beforeEach(() => {
      HexDistanceChoice.set('EUCLIDIAN');
    });

    describe('w/ Elevation', () => {
      beforeEach(() => {
        HexIncludeElevation.set(true);
      });

      it.each([
        // Straight lines
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 0 }],
        ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
        ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['10', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 0 }],
        ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],

        // Integer triangles
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: 20 }],
        ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
        ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: -400, elevation: 0 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 300, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 400, y: 0, elevation: 15 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 15 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: 20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 300, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: 0, elevation: -20 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 0, y: -300, elevation: -20 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 0 }],
        ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 0 }],
        ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 0 }],
        ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 0 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],

        // Integer pyramids
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 60 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 1200, elevation: 20 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 400, elevation: 15 }],
        ['65', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 60 }],
        ['65', { x: 0, y: 400, elevation: 0 }, { x: 300, y: 0, elevation: 60 }],
        ['65', { x: 0, y: 0, elevation: 60 }, { x: 300, y: 400, elevation: 0 }],
        ['125', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 100 }],
        ['125', { x: 900, y: 0, elevation: 100 }, { x: 0, y: 1200, elevation: 0 }],
        ['125', { x: -300, y: 2000, elevation: 75 }, { x: 600, y: 3200, elevation: 175 }],

        // Non-integer results
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
        ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 0 }],
        ['183.22', { x: 5600, y: 200, elevation: 30 }, { x: 8900, y: 1200, elevation: 92 }],
        ['438.49', { x: -1500, y: 5000, elevation: -125 }, { x: 6000, y: 1500, elevation: 20 }],
      ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
        const expected = {
          units: 'mock-units',
          value: expectedValue,
        };
        const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
        const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
        expect(resultA).toEqual(expected);
        expect(resultB).toEqual(expected);
      });
    });

    describe('w/o Elevation', () => {
      beforeEach(() => {
        HexIncludeElevation.set(false);
      });

      it.each([
        // Straight lines
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
        ['5', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 0, elevation: 20 }],
        ['10', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 200, elevation: 20 }],
        ['0', { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 5 }],
        ['20', { x: 400, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
        ['25', { x: 0, y: 500, elevation: 0 }, { x: 0, y: 0, elevation: 20 }],
        ['0', { x: 0, y: 0, elevation: 10 }, { x: 0, y: 0, elevation: 20 }],
        ['35', { x: -400, y: 0, elevation: 0 }, { x: 300, y: 0, elevation: 50 }],

        // Integer triangles
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: 300, y: 400, elevation: 10 }],
        ['25', { x: 300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 20 }],
        ['25', { x: -300, y: 0, elevation: 0 }, { x: 0, y: 400, elevation: 30 }],
        ['25', { x: 0, y: 400, elevation: 10 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: -400, elevation: 20 }, { x: 300, y: 0, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 30 }, { x: 400, y: 300, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 50 }, { x: -300, y: 400, elevation: 100 }],
        ['25', { x: 0, y: 0, elevation: -20 }, { x: 300, y: -400, elevation: 0 }],
        ['25', { x: 0, y: 0, elevation: 0 }, { x: -300, y: -400, elevation: 25 }],
        ['65', { x: 0, y: 0, elevation: 0 }, { x: 500, y: 1200, elevation: 25 }],
        ['75', { x: 0, y: 0, elevation: 0 }, { x: 900, y: 1200, elevation: 25 }],
        ['100', { x: 0, y: 0, elevation: 0 }, { x: 1200, y: 1600, elevation: 25 }],
        ['175', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 2800, elevation: 25 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 0 }],
        ['375', { x: 0, y: 0, elevation: 0 }, { x: 2100, y: 7200, elevation: 25 }],

        // Non-integer results
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 0 }],
        ['7.07', { x: 0, y: 0, elevation: 0 }, { x: 100, y: 100, elevation: 25 }],
        ['70.71', { x: 0, y: 0, elevation: 0 }, { x: 1000, y: 1000, elevation: 100 }],
      ])('returns %j for (%j, %j)', (expectedValue, from, to) => {
        const expected = {
          units: 'mock-units',
          value: expectedValue,
        };
        const resultA = calculateDistanceWithUnits(scene, grid, mockTokenCenter(from), mockTokenCenter(to));
        const resultB = calculateDistanceWithUnits(scene, grid, mockTokenCenter(to), mockTokenCenter(from));
        expect(resultA).toEqual(expected);
        expect(resultB).toEqual(expected);
      });
    });
  });
});
