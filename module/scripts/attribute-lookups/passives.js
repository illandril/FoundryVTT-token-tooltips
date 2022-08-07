import isPF1LiteNPC from './pf1/isLiteNPC.js';
import pf1SystemID from './pf1/systemID.js';
import pf2eSystemID from './pf2e/systemID.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const passive = (key, icon) => {
  return {
    icon: () => icon,
    label: () => {
      switch (game.system.id) {
        case 'dnd5e':
          return (
            game.i18n.localize(`DND5E.Skill${capitalize(key)}`) +
            ' (' +
            game.i18n.localize('DND5E.Passive') +
            ')'
          );
      }
      return `[${key.toUpperCase()}]`;
    },
    value: (actor) => getProperty(actor.system, `skills.${key}.passive`),
  };
};

export default [
  // dnd5e (and similar system) passives
  passive('prc', 'eye'),
  passive('inv', 'search'),
  passive('ins', 'brain'),

  // PF1 Perception
  {
    icon: () => 'eye',
    label: () => {
      return game.i18n.localize('PF1.SkillPer');
    },
    value: (actor) => {
      if (game.system.id !== pf1SystemID || isPF1LiteNPC(actor)) {
        return null;
      }
      return getProperty(actor.system, `skills.per.mod`);
    },
  },

  // PF2 Perception
  {
    icon: () => 'eye',
    label: () => {
      return game.i18n.localize('PF2E.PerceptionLabel');
    },
    value: (actor) => {
      if (game.system.id !== pf2eSystemID) {
        return null;
      }
      const value = getProperty(actor.system, `attributes.perception.value`);
      if(value !== undefined) {
        return parseInt(value,10) + 10;
      }
    },
  },
];
