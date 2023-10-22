import calculateDistanceEuclidian from './calculateDistanceEuclidian';

it.each([
  // Straight lines
  [0, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
  [1, { x: 0, y: 0, elevation: 0 }, { x: 1, y: 0, elevation: 0 }],
  [2, { x: 0, y: 0, elevation: 0 }, { x: 2, y: 0, elevation: 0 }],
  [3, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 0, elevation: 0 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: 4, y: 0, elevation: 0 }],
  [1, { x: 0, y: 0, elevation: 0 }, { x: -1, y: 0, elevation: 0 }],
  [2, { x: 0, y: 0, elevation: 0 }, { x: -2, y: 0, elevation: 0 }],
  [3, { x: 0, y: 0, elevation: 0 }, { x: -3, y: 0, elevation: 0 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: -4, y: 0, elevation: 0 }],
  [1, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 1, elevation: 0 }],
  [2, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 2, elevation: 0 }],
  [3, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 3, elevation: 0 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 4, elevation: 0 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: 0, y: -4, elevation: 0 }],
  [1, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 1 }],
  [2, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 2 }],
  [3, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 3 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 4 }],
  [4, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: -4 }],
  [4, { x: 4, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
  [2, { x: 3, y: 0, elevation: 0 }, { x: 1, y: 0, elevation: 0 }],
  [0, { x: 2, y: 0, elevation: 0 }, { x: 2, y: 0, elevation: 0 }],
  [1, { x: 4, y: 0, elevation: 0 }, { x: 3, y: 0, elevation: 0 }],
  [4, { x: -4, y: 0, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
  [4, { x: -3, y: 0, elevation: 0 }, { x: 1, y: 0, elevation: 0 }],
  [4, { x: -2, y: 0, elevation: 0 }, { x: 2, y: 0, elevation: 0 }],
  [4, { x: -1, y: 0, elevation: 0 }, { x: 3, y: 0, elevation: 0 }],
  [4, { x: 0, y: -4, elevation: 0 }, { x: 0, y: 0, elevation: 0 }],
  [4, { x: 0, y: -3, elevation: 0 }, { x: 0, y: 1, elevation: 0 }],
  [4, { x: 0, y: -2, elevation: 0 }, { x: 0, y: 2, elevation: 0 }],
  [4, { x: 0, y: -1, elevation: 0 }, { x: 0, y: 3, elevation: 0 }],

  // Integer triangles
  [5, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 4, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 0, elevation: 4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 3, elevation: 4 }],
  [5, { x: 3, y: 0, elevation: 0 }, { x: 0, y: 4, elevation: 0 }],
  [5, { x: -3, y: 0, elevation: 0 }, { x: 0, y: 4, elevation: 0 }],
  [5, { x: 0, y: 4, elevation: 0 }, { x: 3, y: 0, elevation: 0 }],
  [5, { x: 0, y: -4, elevation: 0 }, { x: 3, y: 0, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 4, y: 3, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 4, y: 0, elevation: 3 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 4, elevation: 3 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: -3, y: 4, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: -3, y: 0, elevation: 4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 0, y: -3, elevation: 4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 3, y: -4, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 0, elevation: -4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 0, y: 3, elevation: -4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: -3, y: -4, elevation: 0 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: -3, y: 0, elevation: -4 }],
  [5, { x: 0, y: 0, elevation: 0 }, { x: 0, y: -3, elevation: -4 }],
  [13, { x: 0, y: 0, elevation: 0 }, { x: 5, y: 12, elevation: 0 }],
  [15, { x: 0, y: 0, elevation: 0 }, { x: 9, y: 12, elevation: 0 }],
  [20, { x: 0, y: 0, elevation: 0 }, { x: 12, y: 16, elevation: 0 }],
  [35, { x: 0, y: 0, elevation: 0 }, { x: 21, y: 28, elevation: 0 }],
  [75, { x: 0, y: 0, elevation: 0 }, { x: 21, y: 72, elevation: 0 }],

  // Integer pyramids
  [13, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 4, elevation: 12 }],
  [13, { x: 0, y: 0, elevation: 0 }, { x: 3, y: 12, elevation: 4 }],
  [13, { x: 0, y: 0, elevation: 0 }, { x: 12, y: 4, elevation: 3 }],
  [13, { x: 3, y: 0, elevation: 0 }, { x: 0, y: 4, elevation: 12 }],
  [13, { x: 0, y: 4, elevation: 0 }, { x: 3, y: 0, elevation: 12 }],
  [13, { x: 0, y: 0, elevation: 12 }, { x: 3, y: 4, elevation: 0 }],
  [25, { x: 0, y: 0, elevation: 0 }, { x: 9, y: 12, elevation: 20 }],
  [25, { x: 9, y: 0, elevation: 20 }, { x: 0, y: 12, elevation: 0 }],
  [25, { x: -3, y: 20, elevation: 15 }, { x: 6, y: 32, elevation: 35 }],

  // Non-integer results
  [7.071, { x: 0, y: 0, elevation: 0 }, { x: 5, y: 5, elevation: 0 }],
  [70.711, { x: 0, y: 0, elevation: 0 }, { x: 50, y: 50, elevation: 0 }],
  [92.655, { x: 56, y: 2, elevation: 6 }, { x: 89, y: 12, elevation: 92 }],
  [94.207, { x: -15, y: 50, elevation: -25 }, { x: 60, y: 15, elevation: 20 }],
])('returns %j for (%j, %j)', (expected, from, to) => {
  const resultA = calculateDistanceEuclidian(from, to);
  const resultB = calculateDistanceEuclidian(to, from);
  expect(resultA).toBeCloseTo(expected, 3);
  expect(resultB).toBeCloseTo(expected, 3);
});
