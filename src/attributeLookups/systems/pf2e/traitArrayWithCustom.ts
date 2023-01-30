import string from '../../../dataConversion/string';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import systemID from './systemID';

const getLabelFromType = (type: string | null, propertyKey: string, fallback: string | null) => {
  let label = fallback;
  if (type) {
    let labelLookup: { [key: string]: string | undefined } | undefined;
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

const getLabel = (value: unknown, propertyKey: string): string | null => {
  let type: string | null;
  let fallback: string | null;
  let suffix: string | undefined;
  if (typeof value === 'string') {
    type = value;
    fallback = value;
  } else {
    const valueObj = unknownObject(value);
    if (!valueObj) {
      return null;
    }
    type = string(valueObj.type);
    fallback = string(valueObj.label || type);
    if (typeof valueObj.value === 'number' || typeof valueObj.value === 'string') {
      suffix = ` (${valueObj.value})`;
    }
  }
  const label = getLabelFromType(type, propertyKey, fallback);
  if (!label) {
    return null;
  }
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
      module.logger.debug('pf2e traitWithCustom', propertyKey, actor.name, actor.system);

      const property = foundry.utils.getProperty(actor.system, `traits.${propertyKey}`);
      let allValues: (string | null)[];
      if (Array.isArray(property)) {
        allValues = property.map((value) => getLabel(value, propertyKey));
      } else {
        const propertyObj = unknownObject(property);
        if (!propertyObj) {
          return null;
        }
        let stdValues: (string | null)[];
        if (Array.isArray(propertyObj?.value)) {
          stdValues = propertyObj.value.map((value) => getLabel(value, propertyKey));
        } else {
          stdValues = [];
        }
        const customValues = stringArrayOrSet(propertyObj?.custom);
        allValues = stdValues.concat(customValues);
      }
      const allStringValues = allValues.filter((value): value is string => !!value);
      return calculateValue(allStringValues);
    },
  );
};

export default traitArrayWithCustom;
