import capitalize from '../dataConversion/capitalize';
import stringToInt from '../dataConversion/stringToInt';
import calculateValue from '../tooltip/calculateValue';
import AttributeLookup from './AttributeLookup';
import dnd5eSystemID from './systems/dnd5e/systemID';
import isPF1LiteNPC from './systems/pf1/isLiteNPC';
import pf1SystemID from './systems/pf1/systemID';
import pf2eSystemID from './systems/pf2e/systemID';

const passive = (key: string, icon: string) => {
  return new AttributeLookup(
    () => icon,
    () => {
      if (game.system.id === dnd5eSystemID) {
        return (
          game.i18n.localize(`DND5E.Skill${capitalize(key)}`)
            + ' ('
            + game.i18n.localize('DND5E.Passive')
            + ')'
        );
      }
      return `[${key.toUpperCase()}]`;
    },
    (actor) => calculateValue(foundry.utils.getProperty(actor.system, `skills.${key}.passive`)),
  );
};

export default [
  // dnd5e (and similar system) passives
  passive('prc', 'eye'),
  passive('inv', 'search'),
  passive('ins', 'brain'),

  // PF1 Perception
  new AttributeLookup(
    () => 'eye',
    () => {
      return game.i18n.localize('PF1.SkillPer');
    },
    (actor) => {
      if (game.system.id !== pf1SystemID || isPF1LiteNPC(actor)) {
        return null;
      }
      return calculateValue(foundry.utils.getProperty(actor.system, `skills.per.mod`));
    },
  ),

  // PF2 Perception
  new AttributeLookup(
    () => 'eye',
    () => {
      return game.i18n.localize('PF2E.PerceptionLabel');
    },
    (actor) => {
      if (game.system.id !== pf2eSystemID) {
        return null;
      }
      const value = foundry.utils.getProperty(actor.system, `attributes.perception.value`);
      let numValue: number | null;
      if (typeof value === 'string') {
        numValue = stringToInt(value);
      } else if (typeof value === 'number' && !isNaN(value)) {
        numValue = value;
      } else {
        numValue = null;
      }
      if (numValue !== null) {
        return {
          value: numValue + 10,
        };
      }
      return null;
    },
  ),
] satisfies AttributeLookup[];
