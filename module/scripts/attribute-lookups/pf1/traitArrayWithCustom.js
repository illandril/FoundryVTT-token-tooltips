import { calculateValue } from '../../ui/attribute-row.js';
import { KEY as MODULE_KEY } from '../../module.js';
import systemID from './systemID.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLabel = (value, propertyKey) => {
  if(propertyKey === 'ci') {
    return CONFIG.PF1.conditionTypes[value] || value;
  } else if (propertyKey === 'di' || propertyKey === 'dv') {
    return CONFIG.PF1.damageTypes[value] || value;
  }
  return value;
}

const traitArrayWithCustom = (localeKey, propertyKey) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`${MODULE_KEY}.tooltip.${localeKey}.label`),
    value: (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = getProperty(actor.system, `traits.${propertyKey}`);
      const stdValues = (property?.value || []).map((value) => getLabel(value, propertyKey));
      const customValues = property?.custom?.split(';') || [];
      const allValues = stdValues.concat(customValues).filter((v) => !!v);
      return calculateValue(allValues);
    },
  };
};

export default traitArrayWithCustom;
