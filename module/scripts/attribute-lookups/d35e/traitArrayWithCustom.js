import { calculateValue } from '../../ui/attribute-row.js';
import { KEY as MODULE_KEY } from '../../module.js';
import systemID from './systemID.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const traitArrayWithCustom = (localeKey, propertyKey, valueLocalePrefix) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`${MODULE_KEY}.tooltip.${localeKey}.label`),
    value: (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = getProperty(actor.system, `traits.${propertyKey}`);
      const stdValues = (property?.value || []).map((value) => {
        const upperFirstValue = value.substring(0, 1).toUpperCase() + value.substring(1);
        return game.i18n.localize(`D35E.${valueLocalePrefix}${upperFirstValue}`) || value;
      });
      const customValues = property?.custom?.split(/[;,]/) || [];
      const allValues = stdValues.concat(customValues).filter((v) => !!v);
      return calculateValue(allValues);
    },
  };
};

export default traitArrayWithCustom;
