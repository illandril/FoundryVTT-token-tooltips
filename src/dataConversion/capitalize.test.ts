import capitalize from './capitalize';

it.each([
  ['', ''],
  ['A', 'a'],
  ['Alphabet', 'alphabet'],
  ['Alphabet', 'Alphabet'],
  ['Fruit loops', 'fruit loops'],
  ['Fruit Loops', 'Fruit Loops'],
  ['WHaTeVeR', 'wHaTeVeR'],
  ['WhAtEvEr', 'WhAtEvEr'],
])('should return %j for %j', (expectedOutput, input) => {
  const output = capitalize(input);
  expect(output).toBe(expectedOutput);
});
