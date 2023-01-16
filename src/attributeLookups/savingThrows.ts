import module from '../module';
import calculateValue from '../tooltip/calculateValue';
import AttributeLookup from './AttributeLookup';
import capitalize from './dataConversion/capitalize';
import isDND35LiteNPC from './systems/d35e/isLiteNPC';
import dnd5eSystemID from './systems/dnd5e/systemID';
import isPF1LiteNPC from './systems/pf1/isLiteNPC';

export const unsupportedSystems = [dnd5eSystemID];

const pf1SavingThrow = (key: string) => {
  // Note: This is also for D&D 3.5 (D35E)
  return new AttributeLookup(
    () => null,
    () => module.localize(`savingThrow${capitalize(key)}`),
    (actor) => {
      if (isDND35LiteNPC(actor)) {
        return null;
      }
      const value = foundry.utils.getProperty(actor.system, `attributes.savingThrows.${key}`);
      if (value && isPF1LiteNPC(actor) && value?.total === 0) {
        return null;
      }
      return calculateValue(value);
    },
  );
};

const pf2SavingThrow = (key: string, locKey: string) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`savingThrow${capitalize(locKey)}`),
    (actor) => {
      const save = foundry.utils.getProperty(actor.system, `saves.${key}`);
      if (!save) {
        return null;
      }
      const modifier = save.totalModifier || 0;
      const dc = modifier + 10;
      return {
        value: `+${modifier} (DC ${dc})`,
      };
    },
  );
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
] satisfies AttributeLookup[];
