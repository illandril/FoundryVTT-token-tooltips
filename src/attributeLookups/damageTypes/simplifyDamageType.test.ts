import simplifyDamageType, { SimplifyDamageTypeChoice } from './simplifyDamageType';

beforeAll(() => {
  Hooks.callAll('init');
});
afterAll(() => {
  SimplifyDamageTypeChoice.set('NONE');
});

describe('NONE', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('NONE');
  });

  it.each([
    ['Acid', 'acid'],
    ['Bludgeoning', 'bludgeoning'],
    ['Fire', 'fire'],
    ['Special', 'special'],
    ['Bludgeoning, Piercing, and Slashing from attacks that are not Magical', 'nonmagical-physical'],
    ['B&L', 'buy-and-large'],
  ])('should render localized value (%s) as a text node (raw: %s) as Acid', (localized, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(Text);
    expect(value.textContent).toBe(localized);
  });
});

describe('COLOR', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('COLOR');
  });

  it.each([
    ['Acid', '#306100', 'acid'],
    ['Bludgeoning', '#444', 'bludgeoning'],
    ['Fire', '#840', 'fire'],
  ])('should render localized string (%s) with color (%s) for %s', (localized, expectedColor, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);
    expect(value.textContent).toBe(localized);
    expect(value).toHaveStyle({ color: expectedColor });
  });

  it.each([
    ['Special', 'special'],
    ['B&L', 'buy-and-large'],
  ])('should render localized string (%s) for %s', (localized, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLElement);
    expect((value as HTMLElement).tagName).toBe('SPAN');
    expect(value.textContent).toBe(localized);
    expect(value as HTMLElement).toHaveStyle({ color: '' });
  });
});

describe('ICON', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('ICON');
  });

  it.each([
    ['fa-droplet', 'acid', 'Acid'],
    ['fa-hammer-war', 'bludgeoning', 'Bludgeoning'],
    ['fa-fire', 'fire', 'Fire'],
  ])('should render icon (%s) for %s', (expectedIcon, raw, localized) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLElement);
    expect((value as HTMLElement).tagName).toBe('I');
    expect(value).toHaveClass('fas');
    expect(value).toHaveClass(expectedIcon);
    expect(value).toHaveAccessibleName(localized);
    expect(value).toHaveStyle({ color: '' });
  });

  it.each([
    ['Special', 'special'],
    ['B&L', 'buy-and-large'],
  ])('should render localized string (%s) for %s', (localized, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);
    expect(value.textContent).toBe(localized);
    expect(value).toHaveStyle({ color: '' });
  });
});

describe('COLOR_ICON', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('COLOR_ICON');
  });

  it.each([
    ['fa-droplet', '#306100', 'acid', 'Acid'],
    ['fa-hammer-war', '#444', 'bludgeoning', 'Bludgeoning'],
    ['fa-snowflake', '#005B90', 'cold', 'Cold'],
    ['fa-snowflake', '#005B90', 'Cold', 'Cold'],
    ['fa-snowflake', '#005B90', 'COLD', 'Cold'],
    ['fa-snowflake', '#005B90', 'cold', 'cold'],
    ['fa-snowflake', '#005B90', 'cold', 'frío'],
    ['fa-fire', '#840', 'fire', 'Fire'],
    ['fa-comet', '#00A', 'force', 'Force'],
    ['fa-bolt-lightning', '#5A5A00', 'lightning', 'Lightning'],
    ['fa-scythe', '#000', 'necrotic', 'Necrotic'],
    ['fa-bow-arrow', '#444', 'piercing', 'Piercing'],
    ['fa-flask-round-poison', '#060', 'poison', 'Poison'],
    ['fa-face-vomit', '#060', 'poisoned', 'Poisoned'],
    ['fa-brain-circuit', '#50B', 'psychic', 'Psychic'],
    ['fa-star-christmas', '#595933', 'radiant', 'Radiant'],
    ['fa-sword', '#444', 'slashing', 'Slashing'],
    ['fa-volume-high', '#333', 'thunder', 'Thunder'],
  ])('should render icon (%s) with color (%s) for %s', (expectedIcon, expectedColor, raw, localized) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLElement);
    expect((value as HTMLElement).tagName).toBe('I');
    expect(value).toHaveClass('fas');
    expect(value).toHaveClass(expectedIcon);
    expect(value).toHaveAccessibleName(localized);
    expect(value).toHaveStyle({ color: expectedColor });
  });

  it.each([
    ['Special', 'special'],
    ['B&L', 'buy-and-large'],
  ])('should render localized string (%s) for %s', (localized, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);
    expect(value.textContent).toBe(localized);
    expect(value).toHaveStyle({ color: '' });
  });
});

describe('ICON_AND_TEXT', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('ICON_AND_TEXT');
  });

  it.each([
    ['fa-droplet', 'Acid', '#306100', 'acid'],
    ['fa-hammer-war', 'Bludgeoning', '#444', 'bludgeoning'],
    ['fa-fire', 'Fire', '#840', 'fire'],
  ])('should render icon (%s) and localized string (%s) with color (%s) for %s', (expectedIcon, localized, expectedColor, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);

    const icon = (value as HTMLElement).firstElementChild as HTMLElement;
    expect(icon.tagName).toBe('I');
    expect(icon).toHaveClass('fas');
    expect(icon).toHaveClass(expectedIcon);
    expect(icon).toHaveAccessibleName('');

    const space = icon.nextSibling as Text;
    expect(space).toBeInstanceOf(Text);
    expect(space.textContent).toBe('\u00a0');

    const text = space.nextSibling as Text;
    expect(text).toBeInstanceOf(Text);
    expect(text.textContent).toBe(localized);

    expect(text.nextSibling).toBeNull();

    expect(value).toHaveStyle({ color: expectedColor });
  });

  it.each([
    ['Special', 'special'],
    ['B&L', 'buy-and-large'],
  ])('should render localized string (%s) for %s', (localized, raw) => {
    const value = simplifyDamageType({
      localized,
      raw,
    });

    expect(value).toBeInstanceOf(HTMLElement);
    expect((value as HTMLElement).tagName).toBe('SPAN');
    expect(value.textContent).toBe(localized);
    expect(value as HTMLElement).toHaveStyle({ color: '' });
  });
});

