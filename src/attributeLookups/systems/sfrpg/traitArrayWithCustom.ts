import capitalize from '../../../dataConversion/capitalize';
import filterEmpty from '../../../dataConversion/filterEmpty';
import localizeOrFallback from '../../../dataConversion/localizeOrFallback';
import splitOn from '../../../dataConversion/splitOn';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import { LocalizedValueSimplifier } from '../../LocalizedValueSimplifier';
import systemID from './systemID';

type MaybeTrait = undefined | {
  value?: unknown
  custom?: unknown
};

const traitArrayWithCustom = (localeKey: string, propertyKey: string, valueLocalePrefix: string, simplifier?: LocalizedValueSimplifier) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const property = foundry.utils.getProperty(actor.system, `traits.${propertyKey}`) as MaybeTrait;
      const values = stringArrayOrSet(property?.value) || [];
      const stdValues = values.map((value) => {
        const capitalized = value.split('-').map(capitalize).join('');
        const label = localizeOrFallback(`SFRPG.${valueLocalePrefix}${capitalized}`, value);
        return simplifier
          ? simplifier({
            localized: label,
            raw: value || label,
          })
          : document.createTextNode(label);
      });
      const customValues = splitOn(property?.custom, /[;,]/) || [];
      const allValues = stdValues.concat(
        customValues.map((value) => document.createTextNode(value)),
      ).filter(filterEmpty);
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
