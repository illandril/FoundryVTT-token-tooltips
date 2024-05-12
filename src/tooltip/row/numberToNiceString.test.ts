import numberToNiceString from './numberToNiceString';

beforeAll(() => {
  jest.spyOn(Intl, 'NumberFormat');
});

describe.each(['en-US', 'de-DE'])('%s', (locale) => {
  beforeEach(() => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue(locale);
  });

  it.each([
    // Common Fractions
    ['⅛', 0.125],
    ['¼', 0.25],
    ['⅜', 0.375],
    ['½', 0.5],
    ['⅝', 0.625],
    ['¾', 0.75],
    ['⅞', 0.875],
    ['⅙', 1 / 6],
    ['⅙', 0.166],
    ['⅙', 0.1661],
    ['⅙', 0.1669],
    ['⅙', 0.167],
    ['⅓', 1 / 3],
    ['⅓', 0.333],
    ['⅓', 0.3331],
    ['⅓', 0.3339],
    ['⅓', 0.334],
    ['⅔', 2 / 3],
    ['⅔', 0.666],
    ['⅔', 0.6661],
    ['⅔', 0.6669],
    ['⅔', 0.667],
    ['⅚', 5 / 6],
    ['⅚', 0.833],
    ['⅚', 0.8331],
    ['⅚', 0.8339],
    ['⅚', 0.834],
  ])('fractions - should return %j for %j', (expected, input) => {
    const actual = numberToNiceString(input);

    expect(actual).toBe(expected);

    expect(Intl.NumberFormat).not.toBeCalled();
  });

  it.each([
    // Positive numbers 0 to 999
    ['0', 0],
    ['1', 1],
    ['12', 12],
    ['234', 234],
    ['999', 999],

    // Negative numbers, -1 to -999
    ['-1', -1],
    ['-12', -12],
    ['-234', -234],
    ['-999', -999],
  ])('small integers - should return %j for %j', (expected, input) => {
    const actual = numberToNiceString(input);

    expect(actual).toBe(expected);

    expect(Intl.NumberFormat).toBeCalledTimes(1);
    expect(Intl.NumberFormat).toBeCalledWith(locale, { maximumFractionDigits: 3 });
  });
});

describe('en-US', () => {
  beforeEach(() => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
  });

  it.each([
    // Thousands separator
    ['5,678', 5678],
    ['123,456,789', 123456789],
    ['-123,456,789', -123456789],

    // Decimal digits limited to 3
    ['1.2', 1.2],
    ['1.23', 1.230005],
    ['-1.23', -1.230005],
    ['1.235', 1.23456789],
    ['1,234.568', 1234.56789],
  ])('thousands/decimal separator - should return %j for %j', (expected, input) => {
    const actual = numberToNiceString(input);

    expect(actual).toBe(expected);

    expect(Intl.NumberFormat).toBeCalledTimes(1);
    expect(Intl.NumberFormat).toBeCalledWith('en-US', { maximumFractionDigits: 3 });
  });
});

describe('de-DE', () => {
  beforeEach(() => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
  });

  it.each([
    // Thousands separator
    ['5.678', 5678],
    ['123.456.789', 123456789],
    ['-123.456.789', -123456789],

    // Decimal digits limited to 3
    ['1,2', 1.2],
    ['1,23', 1.230005],
    ['-1,23', -1.230005],
    ['1,235', 1.23456789],
    ['1.234,568', 1234.56789],
  ])('thousands/decimal separator - should return %j for %j', (expected, input) => {
    const actual = numberToNiceString(input);

    expect(actual).toBe(expected);

    expect(Intl.NumberFormat).toBeCalledTimes(1);
    expect(Intl.NumberFormat).toBeCalledWith('de-DE', { maximumFractionDigits: 3 });
  });
});
