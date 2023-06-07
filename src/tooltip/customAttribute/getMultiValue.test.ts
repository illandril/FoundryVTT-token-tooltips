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
  const value = getMultiValue({
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
  } as Actor, 'system.attributes.stealth.value');

  expect(value).toEqual({
    value: 7,
  });
});

it('should return simple values without math (string)', () => {
  const value = getMultiValue({
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
  } as Actor, 'system.attributes.stealth.label');

  expect(value).toEqual({
    value: 'Stealth',
  });
});

it('should return complex values without math', () => {
  const value = getMultiValue({
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
  } as Actor, 'system.attributes.stealth');

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
  const value = getMultiValue({
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
  } as Actor, 'system.attributes.stealth.value + 10');

  expect(value).toEqual({
    value: 17,
  });
});

it('should return null if adding non-numeric values', () => {
  const value = getMultiValue({
    system: {
      a: 10,
      b: 'def',
    },
  } as Actor, 'system.a + system.b');

  expect(value).toEqual(null);
});

it('should return null if actor does not have the specified attribute', () => {
  const value = getMultiValue({
    system: {
      a: 10,
      b: 'def',
    },
  } as Actor, 'system.c');

  expect(value).toEqual(null);
});

it('should add actor attributes correctly', () => {
  const value = getMultiValue({
    system: {
      attributes: {
        hp: {
          value: 7,
          temp: 5,
          max: 10,
        },
      },
    },
  } as Actor, 'system.attributes.hp.value+system.attributes.hp.temp');

  expect(value).toEqual({
    value: 12,
  });
});

describe('operations', () => {
  it('should multiply correctly', () => {
    const value = getMultiValue({
      system: {
        a: 3,
        b: 5,
      },
    } as Actor, 'system.a * system.b');

    expect(value).toEqual({
      value: 15,
    });
  });


  it('should divide correctly (integer result)', () => {
    const value = getMultiValue({
      system: {
        a: 20,
        b: 5,
      },
    } as Actor, 'system.a / system.b');

    expect(value).toEqual({
      value: 4,
    });
  });

  it('should divide correctly (float result)', () => {
    const value = getMultiValue({
      system: {
        a: 18,
        b: 5,
      },
    } as Actor, 'system.a / system.b');

    expect(value).toEqual({
      value: 3.6,
    });
  });

  it('should modulo correctly', () => {
    const value = getMultiValue({
      system: {
        a: 13,
        b: 10,
      },
    } as Actor, 'system.a % system.b');

    expect(value).toEqual({
      value: 3,
    });
  });

  describe('greater than', () => {
    it('pass (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a > system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a > system.b');

      expect(value).toEqual(null);
    });

    it('fail (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a > system.b');

      expect(value).toEqual(null);
    });
  });

  describe('greater or equal', () => {
    it('pass (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a >= system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('pass (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a >= system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a >= system.b');

      expect(value).toEqual(null);
    });
  });

  describe('less than', () => {
    it('fail (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a < system.b');

      expect(value).toEqual(null);
    });

    it('fail (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a < system.b');

      expect(value).toEqual(null);
    });

    it('pass (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a < system.b');

      expect(value).toEqual({
        value: 13,
      });
    });
  });

  describe('less or equal', () => {
    it('fail (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a <= system.b');

      expect(value).toEqual(null);
    });

    it('pass (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a <= system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('pass (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a <= system.b');

      expect(value).toEqual({
        value: 13,
      });
    });
  });

  describe('equal equal', () => {
    it('fail (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a == system.b');

      expect(value).toEqual(null);
    });

    it('pass (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a == system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a == system.b');

      expect(value).toEqual(null);
    });
  });

  describe('not equal', () => {
    it('pass (greater)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 12,
        },
      } as Actor, 'system.a != system.b');

      expect(value).toEqual({
        value: 13,
      });
    });

    it('fail (equal)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 13,
        },
      } as Actor, 'system.a != system.b');

      expect(value).toEqual(null);
    });

    it('pass (less)', () => {
      const value = getMultiValue({
        system: {
          a: 13,
          b: 14,
        },
      } as Actor, 'system.a != system.b');

      expect(value).toEqual({
        value: 13,
      });
    });
  });
});
