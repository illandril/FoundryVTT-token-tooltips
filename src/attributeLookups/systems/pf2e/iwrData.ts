
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
      const property = foundry.utils.getProperty(actor, `system.attributes.${propertyKey}`);
      module.logger.debug('pf2e iwrLookup', propertyKey, actor.name, propertyKey, property);

      if (!Array.isArray(property)) {
        return null;
      }

      const values: Node[] = [];
      for (const value of property) {
        const valueObj = unknownObject(value);
        const label = valueObj?.label;
        const type = valueObj?.type;
        if (typeof label === 'string') {
          values.push(simplifier
            ? simplifier({
              localized: label,
              raw: typeof type === 'string' ? type : label,
            })
            : document.createTextNode(label));
        }
      }
      return calculateValue(values);
    },
  );
};

export default iwrLookup;
