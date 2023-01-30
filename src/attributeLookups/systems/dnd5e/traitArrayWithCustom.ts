import capitalize from '../../../dataConversion/capitalize';
import splitOn from '../../../dataConversion/splitOn';
import stringArrayOrSet from '../../../dataConversion/stringArrayOrSet';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import systemID from './systemID';

const traitArrayWithCustom = (localeKey: string, propertyKey: string, valueLocalePrefix: string) => {
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
      const stdValues = values.map((value) => {
        const upperFirstValue = capitalize(value);
        return game.i18n.localize(`DND5E.${valueLocalePrefix}${upperFirstValue}`) || value;
      });
      const customValues = splitOn(property?.custom, ';') || [];
      const allValues = stdValues.concat(customValues).filter((value) => !!value);
      return calculateValue(allValues);
    },
  );
};

export default traitArrayWithCustom;
