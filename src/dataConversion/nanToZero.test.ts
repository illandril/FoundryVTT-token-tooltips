import nanToZero from './nanToZero';

it.each([
  [0, NaN],
  [0, 0 / 0],
  [0, 0],
  [0, ''],
  [0, 'x'],
  [0, 'a'],
  [0, '0x2'],

  [0, '0'],

  [1, 1],
  [1, '1'],

  [-1, -1],
  [-1, '-1'],

  [10, 10],
  [10, '10'],
  [12345, 12345],
  [12345, '12345'],
  [12.345, 12.345],
  [12.345, '12.345'],
])('should return %j for %p', (expectedOutput, input) => {
  const output = nanToZero(input);
  expect(output).toBe(expectedOutput);
});
