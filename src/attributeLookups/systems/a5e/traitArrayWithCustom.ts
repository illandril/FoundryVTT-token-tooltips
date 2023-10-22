import capitalize from '../../../dataConversion/capitalize';
import filterEmpty from '../../../dataConversion/filterEmpty';
import localizeOrFallback from '../../../dataConversion/localizeOrFallback';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import { LocalizedValueSimplifier } from '../../LocalizedValueSimplifier';
import systemID from './systemID';

const traitArrayWithCustom = (localeKey: string, propertyKey: string, valueLocalePrefix: string, capitalizeLocaleLookup: boolean, simplifier?: LocalizedValueSimplifier) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      module.logger.debug('a5e traitWithCustom', propertyKey, actor.name, actor.system);
      const values = stringArrayOrSet(foundry.utils.getProperty(actor.system, `traits.${propertyKey}`));
      if (!values?.length) {
        return null;
      }
      const stdValues = values.filter(filterEmpty).map((value) => {
        const localeSuffix = capitalizeLocaleLookup ? capitalize(value) : value;
        return {
          localized: localizeOrFallback(`A5E.${valueLocalePrefix}${localeSuffix}`, value),
          raw: value,
        };
      });
      // Customs are included in stdValues, they'll just fall into the localization fallback
      const allValues = stdValues;
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
