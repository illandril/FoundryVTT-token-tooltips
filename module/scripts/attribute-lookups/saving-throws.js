import dnd5eSystemID from './dnd5e/systemID.js';
import isDND35LiteNPC from './d35e/isLiteNPC.js';
import isPF1LiteNPC from './pf1/isLiteNPC.js';

export const unsupportedSystems = [dnd5eSystemID];

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const pf1SavingThrow = (key) => {
  // Note: This is also for D&D 3.5 (D35E)
  return {
    icon: () => null,
    label: () => game.i18n.localize(`illandril-token-tooltips.savingThrow${capitalize(key)}`),
    value: (actor) => {
      if(isDND35LiteNPC(actor)) {
        return null;
      }
      const value = getProperty(actor.system, `attributes.savingThrows.${key}`);
      if(value && isPF1LiteNPC(actor) && value.total === 0) {
        return null;
      }
      return value;
    },
  };
};

const pf2SavingThrow = (key, locKey) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`illandril-token-tooltips.savingThrow${capitalize(locKey)}`),
    value: (actor) => {
      const save = getProperty(actor.system, `saves.${key}`);
      if(!save) {
        return null;
      }
      const modifier = save.totalModifier || 0;
      const dc = modifier + 10;
      return `+${modifier} (DC ${dc})`;
    }
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
