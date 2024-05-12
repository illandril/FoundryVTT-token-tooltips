import getMultiValue from './getMultiValue';

it('should return null for ""', () => {
  const value = getMultiValue({} as Actor, '');

  expect(value).toEqual(null);
});

it('should return 10 for "10"', () => {
  const value = getMultiValue({} as Actor, '10');

  expect(value).toEqual({
    value: 10,
  });
});

it('should return 20 for "10 + 5+7- 2', () => {
  const value = getMultiValue({} as Actor, '10 + 5+7- 2');

  expect(value).toEqual({
    value: 20,
  });
});

it('should return simple values without math (numeric)', () => {
  const value = getMultiValue(
    {
      system: {
        attributes: {
          stealth: {
            label: 'Stealth',
            value: 7,
            dc: 17,
            totalModifier: 7,
            rank: 3,
          },
        },
      },
    } as Actor,
    'system.attributes.stealth.value',
  );

  expect(value).toEqual({
    value: 7,
  });
});

it('should return simple values without math (string)', () => {
  const value = getMultiValue(
    {
      system: {
        attributes: {
          stealth: {
            label: 'Stealth',
            value: 7,
            dc: 17,
            totalModifier: 7,
            rank: 3,
          },
        },
      },
    } as Actor,
    'system.attributes.stealth.label',
  );

  expect(value).toEqual({
    value: 'Stealth',
  });
});

it('should return complex values without math', () => {
  const value = getMultiValue(
    {
      system: {
        attributes: {
          stealth: {
            value: 7,
            dc: 17,
            totalModifier: 7,
            rank: 3,
          },
        },
      },
    } as Actor,
    'system.attributes.stealth',
  );

  expect(value).toEqual({
    value: 7,
    extra: null,
    max: null,
    temp: null,
    tempmax: null,
    units: null,
  });
});

it('should add numbers to actor attributes correctly', () => {
  const value = getMultiValue(
    {
      system: {
        attributes: {
          stealth: {
            value: 7,
            dc: 17,
            totalModifier: 7,
            rank: 3,
          },
        },
      },
    } as Actor,
    'system.attributes.stealth.value + 10',
  );

  expect(value).toEqual({
    value: 17,
  });
});

it('should return null if adding non-numeric values', () => {
  const value = getMultiValue(
    {
      system: {
        a: 10,
        b: 'def',
      },
    } as Actor,
    'system.a + system.b',
  );

  expect(value).toEqual(null);
});

it('should return null if actor does not have the specified attribute', () => {
  const value = getMultiValue(
    {
      system: {
        a: 10,
        b: 'def',
      },
    } as Actor,
    'system.c',
  );

  expect(value).toEqual(null);
});

it('should add actor attributes correctly', () => {
  const value = getMultiValue(
    {
      system: {
        attributes: {
          hp: {
            value: 7,
            temp: 5,
            max: 10,
          },
        },
      },
    } as Actor,
    'system.attributes.hp.value+system.attributes.hp.temp',
  );

  expect(value).toEqual({
    value: 12,
  });
});

describe('operations', () => {
  it('should multiply correctly', () => {
    const value = getMultiValue(
      {
        system: {
          a: 3,
          b: 5,
        },
      } as Actor,
      'system.a * system.b',
    );

    expect(value).toEqual({
      value: 15,
    });
  });

  it('should divide correctly (integer result)', () => {
    const value = getMultiValue(
      {
        system: {
          a: 20,
          b: 5,
        },
      } as Actor,
      'system.a / system.b',
    );

    expect(value).toEqual({
      value: 4,
    });
  });

  it('should divide correctly (float result)', () => {
    const value = getMultiValue(
      {
        system: {
          a: 18,
          b: 5,
        },
      } as Actor,
      'system.a / system.b',
    );

    expect(value).toEqual({
      value: 3.6,
    });
  });

  it('should modulo correctly', () => {
    const value = getMultiValue(
      {
        system: {
          a: 13,
          b: 10,
        },
      } as Actor,
      'system.a % system.b',
    );

    expect(value).toEqual({
      value: 3,
    });
  });

  describe('greater than', () => {
    it('pass (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a > system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a > system.b',
      );

      expect(value).toEqual(null);
    });

    it('fail (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a > system.b',
      );

      expect(value).toEqual(null);
    });
  });

  describe('greater or equal', () => {
    it('pass (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a >= system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('pass (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a >= system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a >= system.b',
      );

      expect(value).toEqual(null);
    });
  });

  describe('less than', () => {
    it('fail (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a < system.b',
      );

      expect(value).toEqual(null);
    });

    it('fail (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a < system.b',
      );

      expect(value).toEqual(null);
    });

    it('pass (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a < system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });
  });

  describe('less or equal', () => {
    it('fail (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a <= system.b',
      );

      expect(value).toEqual(null);
    });

    it('pass (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a <= system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('pass (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a <= system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });
  });

  describe('equal equal', () => {
    it('fail (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a == system.b',
      );

      expect(value).toEqual(null);
    });

    it('pass (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a == system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a == system.b',
      );

      expect(value).toEqual(null);
    });
  });

  describe('not equal', () => {
    it('pass (greater)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 12,
          },
        } as Actor,
        'system.a != system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (equal)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 13,
          },
        } as Actor,
        'system.a != system.b',
      );

      expect(value).toEqual(null);
    });

    it('pass (less)', () => {
      const value = getMultiValue(
        {
          system: {
            a: 13,
            b: 14,
          },
        } as Actor,
        'system.a != system.b',
      );

      expect(value).toEqual({
        value: 13,
      });
    });
  });
});

describe('strings', () => {
  beforeEach(() => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
  });

  it.each([
    ['test', '"test"'],
    ['test', ' "test"'],
    ['test', '"test" '],
    ['test', '    "test"    '],
    ['test', '\t"test"'],
    ['test', '"test"\t'],
    ['test', ' \t \t "test" \t  \t'],
    ['test', '`test`'],
    ['test', "'test'"],
    ['test', '"test\''],
    ['test', "'test`"],
    ['Some string', '"Some string"'],
    [' - ', '" - "'],
    ['"42"', '\'"42"\''],
    ['"42"', '""42""'],
  ])('should return %j for %j', (expected, input) => {
    const value = getMultiValue({} as Actor, input);
    expect(value).toEqual({
      value: expected,
    });
  });
});

describe('concatenation', () => {
  const mockActor = {
    system: {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      ten: 10,
      fifteen: 15,
      twenty: 20,
      units: 'lbs',
      carryWeight: {
        value: 1312,
        max: 1600,
        units: 'ounces',
      },
    },
  } as Actor;

  it.each([
    'system.one & "/" & system.six',
    'system.six & "/" & system.one',
    'system.one & "/" + system.two',
    'system.one & "/" system.two',
    'system.twenty / system.five & " - " & system.ten > system.five & "." & system.five < system.three',
  ])('should return null if any part is invalid (%j)', (input) => {
    const value = getMultiValue(mockActor, input);
    expect(value).toBeNull();
  });

  it.each([
    ['12345', '1&"2"&1+2&2*2&10/2'],
    ['AB', '"A"&&&&&"B"'],
    ['1/2', 'system.one & "/" & system.two'],
    ['15 / 45', 'system.ten + system.five & " / " & system.three * system.fifteen'],
    ['1234', 'system.one & system.two & system.three & system.four'],
    ['4 - 10.3', 'system.twenty / system.five & " - " & system.ten > system.five & "." & system.three < system.five'],
    ['1/2', '(system.one) & "/" & (system.two)'],
    ['6 lbs', 'system.two * system.three & " " & system.units'],
    [
      '1,312 / 1,600 ounces',
      'system.carryWeight.value & " / " & system.carryWeight.max & " " & system.carryWeight.units',
    ],
    ['¾ hours', "system.three / system.four & ` ` & 'hours'"],
  ])('should return %j for key=%j (en-US)', (expected, input) => {
    const value = getMultiValue(mockActor, input);

    expect(value?.value).toEqual(expect.any(Node));
    expect((value?.value as Node).textContent).toBe(expected);
  });

  it.each([
    ['12345', '1&"2"&1+2&2*2&10/2'],
    ['6 lbs', 'system.two * system.three & " " & system.units'],
    [
      '1.312 / 1.600 ounces',
      'system.carryWeight.value & " / " & system.carryWeight.max & " " & system.carryWeight.units',
    ],
    ['¾ hours', "system.three / system.four & ` ` & 'hours'"],
  ])('should return %j for key=%j (de-DE)', (expected, input) => {
    jest.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');

    const value = getMultiValue(mockActor, input);

    expect(value?.value instanceof Node).toBe(true);
    expect((value?.value as Node).textContent).toBe(expected);
  });
});

describe('dashed attribute keys', () => {
  it('should return attribute value if there is an exact match', () => {
    const value = getMultiValue(
      {
        flags: {
          'ceane-talent': {
            strain: {
              total: 123,
            },
          },
        },
      } as unknown as Actor,
      'flags.ceane-talent.strain.total',
    );

    expect(value).toEqual({
      value: 123,
    });
  });

  it('should support concatenation', () => {
    const value = getMultiValue(
      {
        flags: {
          'example-module': {
            value: {
              cur: 123,
              max: 234,
            },
          },
        },
      } as unknown as Actor,
      'flags.example-module.value.cur&" / "&flags.example-module.value.max',
    );

    expect(value?.value instanceof Node).toBe(true);
    expect((value?.value as Node).textContent).toBe('123 / 234');
  });

  it('should support subtraction', () => {
    const value = getMultiValue(
      {
        flags: {
          'example-module': {
            value: {
              cur: 123,
              max: 234,
            },
          },
        },
      } as unknown as Actor,
      'flags.example-module.value.max-flags.example-module.value.cur',
    );

    expect(value).toEqual({
      value: 111,
    });
  });
});
