import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import stringArray from '../../dataConversion/stringArray';
import systemID from './systemID';

const getLabelFromType = (type, propertyKey: string, fallback: string) => {
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

const getLabel = (value, propertyKey: string) => {
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

const traitArrayWithCustom = (localeKey: string, propertyKey: string) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = foundry.utils.getProperty(actor.system, `traits.${propertyKey}`);
      let allValues;
      if (Array.isArray(property)) {
        allValues = property.map((value) => getLabel(value, propertyKey));
      } else {
        if (Array.isArray(property?.value)) {
          allValues = property.value.map((value) => getLabel(value, propertyKey));
        }
        const stdValues = values.map((value) => getLabel(value, propertyKey));
        const customValues = stringArray(property?.custom) || null;
        allValues = stdValues.concat(customValues).filter((value) => !!value);
      }
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
