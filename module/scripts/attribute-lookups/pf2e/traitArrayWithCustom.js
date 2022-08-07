import { calculateValue } from '../../ui/attribute-row.js';
import { KEY as MODULE_KEY } from '../../module.js';
import systemID from './systemID.js';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLabelFromType = (type, propertyKey, fallback) => {
  let label = fallback;
  if (type) {
    let labelLookup;
    if (propertyKey === 'di') {
      labelLookup = CONFIG.PF2E.immunityTypes;
    } else if (propertyKey === 'dr') {
      labelLookup = CONFIG.PF2E.resistanceTypes;
    } else if (propertyKey === 'dv') {
      labelLookup = CONFIG.PF2E.weaknessTypes;
    }

    if (labelLookup) {
      const localeKey = labelLookup[type];
      if (localeKey) {
        label = game.i18n.localize(localeKey);
      }
    }
  }
  return label;
};

const getLabel = (value, propertyKey) => {
  let type;
  let fallback;
  let suffix;
  if (typeof value === 'string') {
    type = value;
    fallback = value;
  } else {
    type = value.type;
    fallback = value.label || type;
    if (value.value) {
      suffix = ` (${value.value})`;
    }
  }
  const label = getLabelFromType(type, propertyKey, fallback);
  if (suffix) {
    return `${label}${suffix}`;
  }
  return label;
};

const traitArrayWithCustom = (localeKey, propertyKey) => {
  return {
    icon: () => null,
    label: () => game.i18n.localize(`${MODULE_KEY}.tooltip.${localeKey}.label`),
    value: (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = getProperty(actor.system, `traits.${propertyKey}`);
      let allValues;
      if (Array.isArray(property)) {
        allValues = property.map((value) => getLabel(value, propertyKey));
      } else {
        const stdValues = (property?.value || []).map((value) => getLabel(value, propertyKey));
        const customValues = property?.custom || null;
        allValues = stdValues.concat(customValues).filter((v) => !!v);
      }
      return calculateValue(allValues);
    },
  };
};

export default traitArrayWithCustom;
