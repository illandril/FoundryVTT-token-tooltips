import stringToInt from './stringToInt';

it.each([
  [0, '0'],
  [1, '1'],
  [10, '10'],
  [123456, '123456'],
  [-5, '-5'],
  [null, '0.0'],
  [null, 'a'],
  [null, 'A'],
])('should return %j for %j', (expectedOutput, input) => {
  const result = stringToInt(input);

  expect(result).toBe(expectedOutput);
});
