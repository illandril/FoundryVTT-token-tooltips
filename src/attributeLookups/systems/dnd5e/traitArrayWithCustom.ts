import capitalize from '../../../dataConversion/capitalize';
import filterEmpty from '../../../dataConversion/filterEmpty';
import splitOn from '../../../dataConversion/splitOn';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import { LocalizedValueSimplifier } from '../../LocalizedValueSimplifier';
import systemID from './systemID';

const traitArrayWithCustom = (localeKey: string, propertyKey: string, valueLocalePrefix: string, simplifier?: LocalizedValueSimplifier) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      module.logger.debug('dnd5e traitWithCustom', propertyKey, actor.name, actor.system);
      const property = unknownObject(foundry.utils.getProperty(actor.system, `traits.${propertyKey}`));
      if (property === null) {
        return null;
      }
      const values = stringArrayOrSet(property?.value) || [];
      const stdValues = values.filter(filterEmpty).map((value) => {
        const upperFirstValue = capitalize(value);
        return {
          localized: game.i18n.localize(`DND5E.${valueLocalePrefix}${upperFirstValue}`) || value,
          raw: value,
        };
      });
      const customValues = splitOn(property?.custom, ';')?.filter(filterEmpty).map((value) => {
        return {
          localized: value,
          raw: value,
        };
      }) || [];
      const allValues = stdValues.concat(customValues);
      let simplifiedValues: string[] | Node[];
      if (simplifier) {
        simplifiedValues = allValues.map(simplifier);
      } else {
        simplifiedValues = allValues.map(({ localized }) => localized);
      }
      return calculateValue(simplifiedValues);
    },
  );
};

export default traitArrayWithCustom;
