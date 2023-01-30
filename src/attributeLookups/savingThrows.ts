import capitalize from '../dataConversion/capitalize';
import nanToZero from '../dataConversion/nanToZero';
import unknownObject from '../dataConversion/unknownObject';
import module from '../module';
import calculateValue from '../tooltip/calculateValue';
import AttributeLookup from './AttributeLookup';
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
      const value = unknownObject(foundry.utils.getProperty(actor.system, `attributes.savingThrows.${key}`));
      if (value && isPF1LiteNPC(actor) && nanToZero(value.total) === 0) {
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
      const save = unknownObject(foundry.utils.getProperty(actor.system, `saves.${key}`));
      if (!save) {
        return null;
      }
      const modifier = nanToZero(save.totalModifier);
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
