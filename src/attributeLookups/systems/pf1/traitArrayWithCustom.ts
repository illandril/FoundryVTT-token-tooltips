import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import splitOn from '../../dataConversion/splitOn';
import stringArray from '../../dataConversion/stringArray';
import systemID from './systemID';

const getLabel = (value: string, propertyKey: string): string => {
  if (propertyKey === 'ci') {
    return CONFIG.PF1.conditionTypes[value] || value;
  } if (propertyKey === 'di' || propertyKey === 'dv') {
    return CONFIG.PF1.damageTypes[value] || value;
  }
  return value;
};

type MaybeTrait = undefined | {
  value?: unknown
  custom?: unknown
};

const traitArrayWithCustom = (localeKey: string, propertyKey: string) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = foundry.utils.getProperty(actor.system, `traits.${propertyKey}`) as MaybeTrait;
      const values = stringArray(property?.value) || [];
      const stdValues = values.map((value) => getLabel(value, propertyKey));
      const customValues = splitOn(property?.custom, ';') || [];
      const allValues = stdValues.concat(customValues).filter((value) => !!value);
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
