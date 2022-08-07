import d35eSystemID from './d35e/systemID.js';
import isDND35LiteNPC from './d35e/isLiteNPC.js';
import pf1SystemID from './pf1/systemID.js';
import isPF1LiteNPC from './pf1/isLiteNPC.js';
import dnd5eSystemID from './dnd5e/systemID.js';
import pf2eSystemID from './pf2e/systemID.js';


const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const d35ePF1Attribute = (key) => {
  return {
    icon: () => null,
    label: () => {
      if(game.system.id === d35eSystemID) {
        return game.i18n.localize(`D35E.AbilityShort${capitalize(key)}`);
      } else {
        return game.i18n.localize(`PF1.AbilityShort${capitalize(key)}`);
      }
    },
    value: (actor) => {
      if(isDND35LiteNPC(actor) || isPF1LiteNPC(actor)) {
        return null;
      }
      const prop = getProperty(actor.system, `abilities.${key}`);
      if (prop) {
        const value = prop.total || 0;
        const modifier = prop.mod || 0;
        return `${value} (${modifier >= 0 ? '+' : ''}${modifier})`;
      }
      return null;
    },
  };
};

const pf2eAttribute = (key) => {
  return {
    icon: () => null,
    label: () => {
      return game.i18n.localize(`PF2E.AbilityId.${key}`);
    },
    value: (actor) => {
      const prop = getProperty(actor.system, `abilities.${key}`);
      if (prop) {
        const value = prop.value || 0;
        const modifier = prop.mod || 0;
        return `${value} (${modifier >= 0 ? '+' : ''}${modifier})`;
      }
      return null;
    },
  };
};

const dnd5eAttribute = (key, abbr) => {
  return {
    icon: () => null,
    label: () => abbr.toUpperCase(),
    value: (actor) => {
      const prop = getProperty(actor.system, `abilities.${key}`);
      if (prop) {
        const value = prop.value || 0;
        const modifier = prop.mod || 0;
        const save = prop.save || 0;
        return `${value} (${modifier >= 0 ? '+' : ''}${modifier}, ${save >= 0 ? '+' : ''}${save})`;
      }
      return null;
    },
  };
};


const values = [];
Hooks.once('ready', () => {
  switch(game.system.id) {
    case dnd5eSystemID:
      values.push(...Object.entries(game.dnd5e.config.abilityAbbreviations).map(([key,value]) => dnd5eAttribute(key, value)));
      break;
    case d35eSystemID:
    case pf1SystemID:
      values.push(...(['str', 'dex', 'con', 'int', 'wis', 'cha']).map((key) => d35ePF1Attribute(key)));
      break;
    case pf2eSystemID:
      values.push(...(['str', 'dex', 'con', 'int', 'wis', 'cha']).map((key) => pf2eAttribute(key)));
      break;
  }
});

export const supportedSystems = [d35eSystemID, pf1SystemID, dnd5eSystemID, pf2eSystemID];
export default values;
