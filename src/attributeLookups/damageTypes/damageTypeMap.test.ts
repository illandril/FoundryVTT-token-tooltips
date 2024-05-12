import { hex } from 'wcag-contrast';
import damageTypeMap from './damageTypeMap';

const optimalBackgroundColor = '#fff';
const minimalBackgroundColor = '#ccc';

const optimalDarkBackgroundColor = '#000';
const minimalDarkBackgroundColor = '#333';

it.each([...damageTypeMap.entries()])('has sufficient contrast (light mode) (%s)', (_name, { color }) => {
  if (!color) {
    expect(color).toBeUndefined();
  } else {
    // WCAG AA for "normal" text
    expect(hex(color, optimalBackgroundColor)).toBeGreaterThan(4.5);
    // WCAG AA for "large" text and GUI components
    expect(hex(color, minimalBackgroundColor)).toBeGreaterThan(3);
  }
});

it.each([...damageTypeMap.entries()])('has sufficient contrast (dark mode) (%s)', (_name, { colorDark }) => {
  if (!colorDark) {
    expect(colorDark).toBeUndefined();
  } else {
    // WCAG AA for "normal" text
    expect(hex(colorDark, optimalDarkBackgroundColor)).toBeGreaterThan(4.5);
    // WCAG AA for "large" text and GUI components
    expect(hex(colorDark, minimalDarkBackgroundColor)).toBeGreaterThan(3);
  }
});
