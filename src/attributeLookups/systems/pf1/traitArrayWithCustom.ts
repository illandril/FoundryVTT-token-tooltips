import filterEmpty from '../../../dataConversion/filterEmpty';
import splitOn from '../../../dataConversion/splitOn';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import { LocalizedValueSimplifier } from '../../LocalizedValueSimplifier';
import systemID from './systemID';

const getLabel = (value: string, propertyKey: string, simplifier?: LocalizedValueSimplifier): Node => {
  let labelLookup: { [key: string]: string | undefined } | undefined;
  if (propertyKey === 'ci') {
    labelLookup = CONFIG.PF1.conditionTypes;
  } else if (propertyKey === 'di' || propertyKey === 'dv') {
    labelLookup = CONFIG.PF1.damageTypes;
  }

  const label = labelLookup?.[value] ?? value;
  return simplifier
    ? simplifier({
      localized: label,
      raw: value || label,
    })
    : document.createTextNode(label);
};

const traitArrayWithCustom = (localeKey: string, propertyKey: string, simplifier?: LocalizedValueSimplifier) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = unknownObject(foundry.utils.getProperty(actor.system, `traits.${propertyKey}`));
      if (!property) {
        return null;
      }
      const values = stringArrayOrSet(property.value) || [];
      const stdValues = values.map((value) => getLabel(value, propertyKey, simplifier));
      const customValues = splitOn(property.custom, ';') || [];
      const allValues = stdValues.concat(
        customValues.map((value) => document.createTextNode(value)),
      ).filter(filterEmpty);
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
