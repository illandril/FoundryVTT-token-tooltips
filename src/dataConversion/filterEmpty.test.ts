import filterEmpty from './filterEmpty';

it.each(['', null, undefined, Number.NaN, 0 / 0])('should return false for %p', (value) => {
  const result = filterEmpty(value);
  expect(result).toBe(false);
});

it('should return false for empty text nodes', () => {
  const result = filterEmpty(document.createTextNode(''));
  expect(result).toBe(false);
});

it.each(['a', 'test', '0', 'NaN', 0, 1, true, false, [], [''], ['a', 'b'], {}, { a: '' }, { a: 'b' }])(
  'should return true for %p',
  (value) => {
    const result = filterEmpty(value);
    expect(result).toBe(true);
  },
);

it('should return true for non-empty text nodes', () => {
  const result = filterEmpty(document.createTextNode('a'));
  expect(result).toBe(true);
});

it('should return true for empty spans', () => {
  const result = filterEmpty(document.createElement('span'));
  expect(result).toBe(true);
});
