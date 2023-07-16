
import localizeOrFallback from '../../../dataConversion/localizeOrFallback';
import string from '../../../dataConversion/string';
import unknownObject from '../../../dataConversion/unknownObject';
import module from '../../../module';
import calculateValue from '../../../tooltip/calculateValue';
import AttributeLookup from '../../AttributeLookup';
import { LocalizedValueSimplifier } from '../../LocalizedValueSimplifier';
import systemID from './systemID';

// iwr = Immunities, Weaknesses, and Resistances
const iwrLookup = (localeKey: string, propertyKey: string, simplifier?: LocalizedValueSimplifier) => {
  return new AttributeLookup(
    () => null,
    () => module.localize(`tooltip.${localeKey}.label`),
    (actor) => {
      if (game.system.id !== systemID) {
        return null;
      }
      const entries = foundry.utils.getProperty(actor, `system.attributes.${propertyKey}`);
      module.logger.debug('pf2e iwrLookup', propertyKey, actor.name, propertyKey, entries);

      if (!Array.isArray(entries)) {
        return null;
      }

      const values: Node[] = [];
      for (const entry of entries) {
        const entryObj = unknownObject(entry);
        const type = string(entryObj?.type);
        const value = entryObj?.value;
        const typeLocaleKey = type && string(unknownObject(entryObj?.typeLabels)?.[type]);
        if (typeof type === 'string') {
          const label = typeLocaleKey ? localizeOrFallback(typeLocaleKey, type) : type;
          const suffix = typeof value === 'number' ? `${value}` : undefined;
          values.push(simplifier
            ? simplifier({
              localized: label,
              raw: type,
              suffix: suffix,
            })
            : document.createTextNode(`${label}${suffix ? ` ${suffix}` : ''}`));
        }
      }
      return calculateValue(values);
    },
  );
};

export default iwrLookup;
