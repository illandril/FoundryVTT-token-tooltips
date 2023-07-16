import { hex } from 'wcag-contrast';
import damageTypeMap from './damageTypeMap';

const optimalBackgroundColor = '#fff';
const minimalBackgroundColor = '#ccc';

it.each([...damageTypeMap.entries()])('has sufficient contrast (%s)', (_name, { color }) => {
  if (!color) {
    expect(color).toBeUndefined();
  } else {
    // WCAG AA for "normal" text
    expect(hex(color, optimalBackgroundColor)).toBeGreaterThan(4.5);
    // WCAG AA for "large" text and GUI components
    expect(hex(color, minimalBackgroundColor)).toBeGreaterThan(3);
  }
});
