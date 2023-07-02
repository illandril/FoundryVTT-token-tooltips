import filterEmpty from '../../../dataConversion/filterEmpty';
import splitOn from '../../../dataConversion/splitOn';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import systemID from './systemID';

const getLabel = (value: string, propertyKey: string): string => {
  let labelLookup: { [key: string]: string | undefined } | undefined;
  if (propertyKey === 'ci') {
    labelLookup = CONFIG.PF1.conditionTypes;
  } else if (propertyKey === 'di' || propertyKey === 'dv') {
    labelLookup = CONFIG.PF1.damageTypes;
  }
  return labelLookup?.[value] ?? value;
};

const traitArrayWithCustom = (localeKey: string, propertyKey: string) => {
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
      const stdValues = values.map((value) => getLabel(value, propertyKey));
      const customValues = splitOn(property.custom, ';') || [];
      const allValues = stdValues.concat(customValues).filter(filterEmpty);
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
