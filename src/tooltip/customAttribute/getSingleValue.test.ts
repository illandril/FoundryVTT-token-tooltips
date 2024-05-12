import getSingleValue from './getSingleValue';

it('should return simple values', () => {
  const result = getSingleValue(
    {
      system: {
        hp: 10,
      },
    } as Actor,
    'system.hp',
  );

  expect(result).toEqual({
    value: 10,
  });
});

it('should return complex values', () => {
  const result = getSingleValue(
    {
      system: {
        hp: {
          value: 10,
          max: 20,
          temp: 5,
          hitDice: 3,
        },
      },
    } as Actor,
    'system.hp',
  );

  expect(result).toEqual({
    value: 10,
    max: 20,
    temp: 5,
    tempmax: null,
    units: null,
    extra: null,
  });
});
