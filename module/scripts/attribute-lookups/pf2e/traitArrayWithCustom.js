import { calculateValue } from '../../ui/attribute-row.js';
import { KEY as MODULE_KEY } from '../../module.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLabel = (value, propertyKey) => {
  let label;
  if(typeof(value) === 'string') {
    label = value;
  } else {
    label = value.label;
    if(value.value) {
      label = `${label} (${value.value})`;
    }
  }
  if(propertyKey === 'di') {
    const localeKey = CONFIG.PF2E.immunityTypes[label];
    if(localeKey) {
      return game.i18n.localize(localeKey);
    }
    return label;
  }
  return label;
}

const traitArrayWithCustom = (localeKey, propertyKey) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`${MODULE_KEY}.tooltip.${localeKey}.label`),
    value: (actor) => {
      if (game.system.id !== 'pf2e') {
        return null;
      }
      const property = getProperty(actor, `data.data.traits.${propertyKey}`);
      let allValues;
      if(Array.isArray(property)) {
        allValues = property.map(value => getLabel(value, propertyKey));
      } else {
        const stdValues = (property?.value || []).map(value => getLabel(value, propertyKey));
        const customValues = property?.custom || null;
        allValues = stdValues.concat(customValues).filter((v) => !!v);
      }
      return calculateValue(allValues);
    },
  };
};

export default traitArrayWithCustom;
