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

  it.each([
    '5', '(+7)', '(-6)',
  ])('should render suffix (%s) after the label', (suffix) => {
    const value = simplifyDamageType({
      localized: 'Acid',
      raw: 'acid',
      suffix,
    });

    expect(value).toBeInstanceOf(Text);
    expect(value.textContent).toBe(`Acid\u00a0${suffix}`);
  });
});

describe('COLOR', () => {
  beforeAll(() => {
    SimplifyDamageTypeChoice.set('COLOR');
  });

  it.each([
    ['Acid', '#316100', 'acid'],
    ['Bludgeoning', '#5E6B69', 'bludgeoning'],
    ['Fire', '#CE3C02', 'fire'],
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
    ['fa-droplet', '#316100', 'acid', 'Acid'],
    ['fa-hammer-war', '#5E6B69', 'bludgeoning', 'Bludgeoning'],
    ['fa-snowflake', '#0078B4', 'cold', 'Cold'],
    ['fa-snowflake', '#0078B4', 'Cold', 'Cold'],
    ['fa-snowflake', '#0078B4', 'COLD', 'Cold'],
    ['fa-snowflake', '#0078B4', 'cold', 'cold'],
    ['fa-snowflake', '#0078B4', 'cold', 'frío'],
    ['fa-fire', '#CE3C02', 'fire', 'Fire'],
    ['fa-comet', '#1C00AF', 'force', 'Force'],
    ['fa-bolt-lightning', '#946A19', 'lightning', 'Lightning'],
    ['fa-scythe', '#000', 'necrotic', 'Necrotic'],
    ['fa-bow-arrow', '#5E6B69', 'piercing', 'Piercing'],
    ['fa-skull-crossbones', '#03822F', 'poison', 'Poison'],
    ['fa-face-vomit', '#03822F', 'poisoned', 'Poisoned'],
    ['fa-brain-circuit', '#841D80', 'psychic', 'Psychic'],
    ['fa-star-christmas', '#8F6D00', 'radiant', 'Radiant'],
    ['fa-sword', '#5E6B69', 'slashing', 'Slashing'],
    ['fa-cloud-bolt', '#24338A', 'thunder', 'Thunder'],
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
    '5', '(+7)', '(-6)',
  ])('should render suffix (%s) after the icon', (suffix) => {
    const value = simplifyDamageType({
      localized: 'Acid',
      raw: 'acid',
      suffix,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);

    const icon = (value as HTMLElement).firstElementChild as HTMLElement;
    expect(icon.tagName).toBe('I');
    expect(icon).toHaveClass('fas');
    expect(icon).toHaveClass('fa-droplet');
    expect(icon).toHaveAccessibleName('Acid');

    const space = icon.nextSibling as Text;
    expect(space).toBeInstanceOf(Text);
    expect(space.textContent).toBe('\u00a0');

    const text = space.nextSibling as Text;
    expect(text).toBeInstanceOf(Text);
    expect(text.textContent).toBe(suffix);

    expect(text.nextSibling).toBeNull();

    expect(value).toHaveStyle({ color: '#316100' });
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
    ['fa-droplet', 'Acid', '#316100', 'acid'],
    ['fa-hammer-war', 'Bludgeoning', '#5E6B69', 'bludgeoning'],
    ['fa-fire', 'Fire', '#CE3C02', 'fire'],
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
    '5', '(+7)', '(-6)',
  ])('should render suffix (%s) after the label', (suffix) => {
    const value = simplifyDamageType({
      localized: 'Acid',
      raw: 'acid',
      suffix,
    });

    expect(value).toBeInstanceOf(HTMLSpanElement);

    const icon = (value as HTMLElement).firstElementChild as HTMLElement;
    expect(icon.tagName).toBe('I');
    expect(icon).toHaveClass('fas');
    expect(icon).toHaveClass('fa-droplet');
    expect(icon).toHaveAccessibleName('');

    const space = icon.nextSibling as Text;
    expect(space).toBeInstanceOf(Text);
    expect(space.textContent).toBe('\u00a0');

    const text = space.nextSibling as Text;
    expect(text).toBeInstanceOf(Text);
    expect(text.textContent).toBe('Acid');

    const space2 = text.nextSibling as Text;
    expect(space2).toBeInstanceOf(Text);
    expect(space2.textContent).toBe('\u00a0');

    const suffixElem = space2.nextSibling as Text;
    expect(suffixElem).toBeInstanceOf(Text);
    expect(suffixElem.textContent).toBe(suffix);

    expect(suffixElem.nextSibling).toBeNull();

    expect(value).toHaveStyle({ color: '#316100' });
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

