import dnd5eSystemID from './dnd5e/systemID.js';

export const unsupportedSystems = [dnd5eSystemID];

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const pf1SavingThrow = (key) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`illandril-token-tooltips.savingThrow${capitalize(key)}`),
    value: (actor) => getProperty(actor, `data.data.attributes.savingThrows.${key}`),
  };
};

const pf2SavingThrow = (key, locKey) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`illandril-token-tooltips.savingThrow${capitalize(locKey)}`),
    value: (actor) => getProperty(actor, `data.data.saves.${key}`)
  };
};

export default [
  // Pathfinder 1 & D&D 3.5
  pf1SavingThrow('fort'),
  pf1SavingThrow('ref'),
  pf1SavingThrow('will'),

  // Pathfinder 2
  pf2SavingThrow('fortitude', 'fort'),
  pf2SavingThrow('reflex', 'ref'),
  pf2SavingThrow('will', 'will'),
];
