import capitalize from '../../../dataConversion/capitalize';
import nanToZero from '../../../dataConversion/nanToZero';
import AttributeLookup from '../../AttributeLookup';
import d35eSystemID from '../d35e/systemID';
import pf1SystemID from '../pf1/systemID';
import isLiteNPC from './isLiteNPC';

type MaybePF1Attribute = undefined | {
  total?: unknown
  mod?: unknown
};
const attribute = (key: string) => {
  return new AttributeLookup(
    () => null,
    () => {
      switch (game.system.id) {
        case d35eSystemID:
          return game.i18n.localize(`D35E.AbilityShort${capitalize(key)}`);
        case pf1SystemID:
          return game.i18n.localize(`PF1.AbilityShort${capitalize(key)}`);
        default:
          return key;
      }
    },
    (actor) => {
      if (isLiteNPC(actor)) {
        return null;
      }
      const prop = foundry.utils.getProperty(actor.system, `abilities.${key}`) as MaybePF1Attribute;
      if (prop) {
        const value = nanToZero(prop.total);
        const modifier = nanToZero(prop.mod);
        return { value: `${value} (${modifier >= 0 ? '+' : ''}${modifier})` };
      }
      return null;
    },
  );
};

export default () => ['str', 'dex', 'con', 'int', 'wis', 'cha'].map((key) => attribute(key));
